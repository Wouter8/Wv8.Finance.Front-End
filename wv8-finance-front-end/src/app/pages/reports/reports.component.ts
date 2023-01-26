import { CurrencyPipe, DatePipe, PercentPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NbCalendarRange, NbDateService } from "@nebular/theme";
import { Maybe } from "@wv8/typescript.core";
import { EChartOption } from "echarts";
import { ITransactionSums, ReportData } from "../../@core/data/report";
import { Category } from "../../@core/models/category.model";
import { ChartTooltip } from "../../@core/models/chart-tooltip/chart-tooltip.model";
import { PeriodReport } from "../../@core/models/period-report.model";
import { CategoryService } from "../../@core/services/category.service";
import { ColorUtils } from "../../@core/utils/color-utils";

const MIN_ANGLE_ROOT_CATEGORY = 10;
const MIN_ANGLE_ROOT_LABEL = 0; //18; // 5%
const MIN_ANGLE_CHILD_CATEGORY = 20;
const MIN_ANGLE_CHILD_LABEL = 0; //20;
const MAX_OPACITY_CHILD_CATEGORY = 30;

enum RootCategoryType {
  Normal,
  Other,
}

enum ChildCategoryType {
  Normal,
  Implicit,
  Other,
}

type ChildCategories = Map<number, ITransactionSums>;

// Display types
type BaseCategory = {
  name: string;
  sums: ITransactionSums;
};
type NormalRootCategory = {
  name: string;
  sums: ITransactionSums;
  children: ChildCategories;
  type: RootCategoryType;
};
type OtherRootCategory = {
  groupedCategories: BaseCategory[];
  type: RootCategoryType;
};

type RootCategory = NormalRootCategory | OtherRootCategory;

type NormalChildCategory = {
  name: string;
  parentName: string;
  sums: ITransactionSums;
  type: ChildCategoryType;
};
type OtherChildCategory = {
  name: string;
  parentName: string;
  groupedCategories: BaseCategory[];
  type: ChildCategoryType;
};

type ChildCategory = NormalChildCategory | OtherChildCategory;

type DeterminedChildCategory = {
  color: string;
  category: ChildCategory;
};

@Component({
  selector: "reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  loading: boolean = false;
  debounceCounter: number = 0;
  hasTransactionData = false;

  report: PeriodReport = null;

  period: NbCalendarRange<Date>;

  netWorthChartOptions: EChartOption;
  byCategoryChartOptions: EChartOption;

  constructor(
    private reportService: ReportData,
    private dateService: NbDateService<Date>,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params.periodStart && params.periodEnd) {
        this.period = {
          start: new Date(params.periodStart),
          end: new Date(params.periodEnd),
        };
      } else {
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        let monthStart = this.dateService.getMonthStart(today);
        this.period = {
          start: this.dateService.addMonth(monthStart, -1),
          end: this.dateService.addDay(monthStart, -1),
        };
      }
    });
  }

  periodSet(period: NbCalendarRange<Date>) {
    this.period = period;
    this.loadReport();
  }

  async loadReport() {
    let debounceNumber = ++this.debounceCounter;
    this.loading = true;
    let queryParams: Params = {
      periodStart: this.period.start.toDateString(),
      periodEnd: this.period.end.toDateString(),
    };
    this.router.navigate([], { relativeTo: this.route, queryParams: queryParams });
    var report = await this.reportService.getPeriodReport(this.period.start, this.period.end);
    this.handleResponse(debounceNumber, report);
  }

  handleResponse(debounceNumber: number, report: PeriodReport) {
    // Only handle this response if it the last requested.
    if (this.debounceCounter !== debounceNumber) return;
    this.report = report;
    this.loading = false;

    this.setNetWorthChartOptions();
    this.setByCategoryChartOptions(); // TODO: Fix chart when no data (= no transactions)
  }

  private setNetWorthChartOptions() {
    this.netWorthChartOptions = {
      color: ["#598bff"],
      tooltip: {
        trigger: "axis",
        formatter: (i: any) =>
          `${this.datePipe.transform(i[0].name, "dd-MM-yyyy")}: ${this.currencyPipe.transform(
            i[0].value,
            "EUR"
          )}`,
      },
      grid: {
        left: "0px",
        right: "0px",
        bottom: "5px",
        top: "5px",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            formatter: (v) => `${this.datePipe.transform(v, "dd-MM-yyyy")}`,
          },
          data: Array.from(this.report.dailyNetWorth.keys()).map((d) => d.toISOString()),
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            formatter: (v) => `${this.currencyPipe.transform(v, "EUR", "symbol", "1.0-0")}`,
          },
        },
      ],
      series: [
        {
          name: "Net worth",
          type: "line",
          areaStyle: {
            opacity: 0.5,
          },
          data: Array.from(this.report.dailyNetWorth.values()),
        },
      ],
    };
  }

  private setByCategoryChartOptions() {
    const rootColors = [
      "#e60049",
      "#0bb4ff",
      "#50e991",
      "#e6d800",
      "#9b19f5",
      "#ffa300",
      "#dc0ab4",
      "#b3d4ff",
      "#00bfa0",
    ];

    let outerColors: string[] = [];
    let innerColors: string[] = [];
    let outerData: RootCategory[] = [];
    let innerData: ChildCategory[] = [];

    let categoriesToShow: RootCategory[] = [];

    // Sort the categories in descending order
    let sortedCategories = Array.from(this.report.totalsPerRootCategory)
      .sort((a, b) => b[1].expense - a[1].expense)
      .map((x) => {
        return { id: x[0], sums: x[1] };
      });

    if (this.report.totals.expense === 0) return;

    // The categories which are too small to see will be grouped
    let categoriesToGroup: { id: number; sums: ITransactionSums }[] = [];

    for (let i = 0; i < sortedCategories.length; i++) {
      let category = sortedCategories[i];
      let angle = (category.sums.expense / this.report.totals.expense) * 360;

      if (angle === 0) continue;

      if (angle < MIN_ANGLE_ROOT_CATEGORY) {
        categoriesToGroup.push(category);
      } else {
        categoriesToShow.push({
          name: this.report.categories.get(category.id).description,
          sums: category.sums,
          children: this.report.totalsPerChildCategory.get(category.id),
          type: RootCategoryType.Normal,
        });
      }
    }

    if (categoriesToGroup.length > 0) {
      categoriesToShow.push({
        groupedCategories: categoriesToGroup.map((c) => {
          return {
            name: this.report.categories.get(c.id).description,
            sums: c.sums,
            children: this.report.totalsPerChildCategory.get(c.id),
            type: RootCategoryType.Normal,
          };
        }),
        type: RootCategoryType.Other,
      });
    }

    for (let i = 0; i < categoriesToShow.length; i++) {
      let category = categoriesToShow[i];
      let categorySums = this.rootCategorySums(category);
      let color = rootColors[i];

      outerColors.push(color);
      outerData.push(category);

      let childCategoriesData = this.getInnerData(
        {
          color: color,
          name: this.rootCategoryName(category),
          sums: categorySums,
          number: i,
        },
        (category as NormalRootCategory)?.children, // TODO: handle children of "other"
        this.report.categories
      );

      for (let j = 0; j < childCategoriesData.length; j++) {
        innerColors.push(childCategoriesData[j].color);
        innerData.push(childCategoriesData[j].category);
      }
    }

    this.byCategoryChartOptions = {
      color: outerColors.concat(innerColors),
      tooltip: {
        trigger: "item",
        confine: true,
      },
      series: [
        {
          name: "Root",
          type: "pie",
          radius: ["70%", "90%"],
          itemStyle: {
            borderWidth: 3,
            borderColor: "#fff",
          },
          emphasis: {
            // TODO
          },
          tooltip: {
            formatter: (data: any) => {
              let category: RootCategory = data.data.category;
              let name = this.rootCategoryName(category).trim();
              let amount = this.rootCategorySums(category).expense;
              let percentage = amount / this.report.totals.expense;

              let currencyPipe = new CurrencyPipe("nl-NL");
              let percentPipe = new PercentPipe("nl-NL");

              switch (category.type) {
                case RootCategoryType.Normal:
                  return `<div class='chart-tooltip'>
                    <span class='tooltip-header'>${name}</span>
                    <div>${currencyPipe.transform(amount, "EUR")} (${percentPipe.transform(
                    percentage
                  )})</div>
                    </div>`;
                case RootCategoryType.Other:
                  let otherCategory = category as OtherRootCategory;

                  let categoriesWithExpenes = otherCategory.groupedCategories.filter(
                    (c) => c.sums.expense > 0
                  );

                  let tooltip = `<div class='chart-tooltip'>
                    <span class='tooltip-header'>${
                      categoriesWithExpenes.length + " categories"
                    }</span>
                    <div>${currencyPipe.transform(amount, "EUR")} (${percentPipe.transform(
                    percentage
                  )})</div>`;

                  for (let i = 0; i < categoriesWithExpenes.length; i++) {
                    let c = categoriesWithExpenes[i];
                    let p = c.sums.expense / this.report.totals.expense;
                    tooltip += `<div>${c.name.trim()}: ${currencyPipe.transform(
                      c.sums.expense,
                      "EUR"
                    )} (${percentPipe.transform(p)})</div>`;
                  }

                  tooltip += `</div>`;

                  return tooltip;
              }
            },
          },
          minShowLabelAngle: MIN_ANGLE_ROOT_LABEL,
          label: {
            color: "white",
            position: "inside",
            textBorderColor: "black",
            textBorderWidth: 2,
            fontSize: 16,
          },
          data: outerData.map((c) => {
            return {
              name: `${this.rootCategoryName(c)}`,
              value: this.rootCategorySums(c).expense,
              category: c,
            };
          }),
        },
        {
          name: "Child",
          type: "pie",
          radius: ["55%", "69%"],
          itemStyle: {
            borderWidth: 3,
            borderColor: "#fff",
          },
          tooltip: {
            formatter: (data: any) => {
              let category: ChildCategory = data.data.category;
              let name = category.name.trim();
              let amount = this.childCategorySums(category).expense;
              let percentage = amount / this.report.totals.expense;

              let currencyPipe = new CurrencyPipe("nl-NL");
              let percentPipe = new PercentPipe("nl-NL");

              switch (category.type) {
                case ChildCategoryType.Normal:
                  return `<div class='chart-tooltip'>
                    <span class='tooltip-header'>${name}</span>
                    <div>${currencyPipe.transform(amount, "EUR")} (${percentPipe.transform(
                    percentage
                  )})</div>
                    </div>`;
                case ChildCategoryType.Other:
                  let otherCategory = category as OtherChildCategory;

                  let categoriesWithExpenes = otherCategory.groupedCategories.filter(
                    (c) => c.sums.expense > 0
                  );

                  let tooltip = `<div class='chart-tooltip'>
                    <span class='tooltip-header'>${
                      categoriesWithExpenes.length + " categories"
                    }</span>
                    <div>${currencyPipe.transform(amount, "EUR")} (${percentPipe.transform(
                    percentage
                  )})</div>`;

                  for (let i = 0; i < categoriesWithExpenes.length; i++) {
                    let c = categoriesWithExpenes[i];
                    if (c.sums.expense > 0) {
                      let p = c.sums.expense / this.report.totals.expense;
                      tooltip += `<div>${c.name.trim()}: ${currencyPipe.transform(
                        c.sums.expense,
                        "EUR"
                      )} (${percentPipe.transform(p)})</div>`;
                    }
                  }

                  tooltip += `</div>`;

                  return tooltip;
                case ChildCategoryType.Implicit:
                  let implicitCategory = category as NormalChildCategory;

                  return `<div class='chart-tooltip'>
                    <span class='tooltip-header'>Not further specified</span>
                    <div>Portion which was added directly to the root category "${implicitCategory.parentName.trim()}".</div>
                    <div>${currencyPipe.transform(amount, "EUR")} (${percentPipe.transform(
                    percentage
                  )})</div></div>`;
              }
            },
          },
          label: { show: false },
          data: innerData.map((c) => {
            return {
              name: `${c.parentName} -> ${c.name}`,
              value: this.childCategorySums(c).expense,
              category: c,
            };
          }),
        },
      ],
    };
  }

  private getInnerData(
    rootCategory: {
      color: string;
      name: string;
      sums: ITransactionSums;
      number: number;
    },
    childCategories: ChildCategories,
    categoryMap: Map<number, Category>
  ): DeterminedChildCategory[] {
    if (!childCategories) childCategories = new Map();

    let categoriesToShow: ChildCategory[] = [];
    let childCategoriesWithRemaining: Map<Maybe<number>, ITransactionSums> = new Map(
      Array.from(childCategories).map((x) => [Maybe.some(x[0]), x[1]])
    );

    // Sort the categories in descending order
    let categories = Array.from(childCategoriesWithRemaining).map((x) => {
      return { id: x[0], sums: x[1] };
    });
    let remaining = categories.reduce(
      (prev, current) => {
        return {
          expense: prev.expense - current.sums.expense,
          income: prev.income - current.sums.income,
        };
      },
      { expense: rootCategory.sums.expense, income: rootCategory.sums.income }
    );
    if (remaining.expense > 0) {
      categories.push({
        id: Maybe.none(),
        sums: remaining,
      });
    }

    let sortedCategories = categories.sort((a, b) => b.sums.expense - a.sums.expense);

    // The categories which are too small to see will be grouped
    let categoriesToGroup: { id: Maybe<number>; sums: ITransactionSums }[] = [];
    for (let i = 0; i < sortedCategories.length; i++) {
      let category = sortedCategories[i];
      let angle = (category.sums.expense / this.report.totals.expense) * 360;

      if (angle < MIN_ANGLE_CHILD_CATEGORY) {
        categoriesToGroup.push(category);
      } else if (category.id.isSome) {
        categoriesToShow.push({
          name: categoryMap.get(category.id.value).description,
          parentName: rootCategory.name,
          sums: category.sums,
          type: ChildCategoryType.Normal,
        });
      } else {
        categoriesToShow.push({
          // TODO: now "Other" always only has a single "Parent" child category, can we improve this?
          name: "Unknown",
          parentName: rootCategory.name,
          sums: category.sums,
          type: ChildCategoryType.Normal,
        });
      }
    }

    if (categoriesToGroup.length > 0) {
      categoriesToShow.push({
        name: "Other",
        parentName: rootCategory.name,
        groupedCategories: categoriesToGroup.map((c) => {
          return {
            name: c.id.map((cId) => categoryMap.get(cId).description).valueOrElse("Parent"),
            sums: c.sums,
          };
        }),
        type: ChildCategoryType.Other,
      });
    }

    let numberOfChildCategories = categoriesToShow.length;
    let lightenStep = MAX_OPACITY_CHILD_CATEGORY / (numberOfChildCategories + 1);

    let data: DeterminedChildCategory[] = [];

    for (let i = 0; i < numberOfChildCategories; i++) {
      let category = categoriesToShow[i];
      let percentage = lightenStep * (i + 1);
      let color =
        category.type === ChildCategoryType.Implicit
          ? rootCategory.color
          : ColorUtils.lighten(rootCategory.color, percentage);

      data.push({
        color: color,
        category: category,
      });
    }

    return data;
  }

  private rootCategorySums(category: RootCategory) {
    if (category.type === RootCategoryType.Normal) {
      return (category as NormalRootCategory).sums;
    } else if (category.type === RootCategoryType.Other) {
      return (category as OtherRootCategory).groupedCategories.reduce(
        (prev, current) => {
          prev.expense += current.sums.expense;
          prev.income += current.sums.income;
          return prev;
        },
        { expense: 0, income: 0 }
      );
    }

    throw "Unknown category type.";
  }

  private rootCategoryName(category: RootCategory) {
    if (category.type === RootCategoryType.Normal) {
      return (category as NormalRootCategory).name;
    } else if (category.type === RootCategoryType.Other) {
      return "Other";
    }

    throw "Unknown category type.";
  }

  private childCategorySums(category: ChildCategory) {
    if (category.type === ChildCategoryType.Normal) {
      return (category as NormalChildCategory).sums;
    } else if (category.type === ChildCategoryType.Other) {
      return (category as OtherChildCategory).groupedCategories.reduce(
        (prev, current) => {
          prev.expense += current.sums.expense;
          prev.income += current.sums.income;
          return prev;
        },
        { expense: 0, income: 0 }
      );
    } else if (category.type === ChildCategoryType.Implicit) {
      return (category as NormalChildCategory).sums;
    }

    throw "Unknown category type.";
  }
}
