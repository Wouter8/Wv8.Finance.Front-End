import { CurrencyPipe, DatePipe, PercentPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NbCalendarRange, NbDateService } from "@nebular/theme";
import { Maybe } from "@wv8/typescript.core";
import { EChartOption } from "echarts";
import { CategoryData } from "../../@core/data/category";
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

enum ByCategoryTab {
  Result = 1,
  Expense = 2,
  Income = 3,
}

type CategoryToShow = {
  categoryId: Maybe<number>;
  name: string;
  color: string;
  value: number;
};

@Component({
  selector: "reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  loading: boolean = false;
  debounceCounter: number = 0;

  period: NbCalendarRange<Date>;
  selectedCategories: Array<Category> = [];
  initializedFilters: boolean = false;

  report: PeriodReport = null;
  categories: Array<Category> = null;

  byCategoryTab: ByCategoryTab = ByCategoryTab.Expense;

  netWorthChartOptions: EChartOption;
  expenseByCategoryChartOptions: EChartOption;
  incomeByCategoryChartOptions: EChartOption;

  constructor(
    private reportService: ReportData,
    private categoryService: CategoryData,
    private dateService: NbDateService<Date>,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories(false, true);
    let params = this.route.snapshot.queryParamMap;
    if (params.has("catId")) {
      let catIds = params.getAll("catId").map(id => parseInt(id));
      this.selectedCategories = this.categories.filter(c => catIds.includes(c.id));
    }

    if (params.has("periodStart") && params.has("periodEnd")) {
      this.period = {
        start: new Date(params.get("periodStart")),
        end: new Date(params.get("periodEnd")),
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

    this.initializedFilters = true;
  }

  periodSet(period: NbCalendarRange<Date>) {
    this.period = period;
    this.loadReport();
  }

  async loadReport() {
    let debounceNumber = ++this.debounceCounter;
    this.loading = true;

    let selectedCategoryIds = this.selectedCategories.map(c => c.id);
    let queryParams: Params = {
      periodStart: this.period.start.toDateString(),
      periodEnd: this.period.end.toDateString(),
      catId: selectedCategoryIds,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true,
    });
    var report = await this.reportService.getPeriodReport(this.period.start, this.period.end, selectedCategoryIds);
    this.handleResponse(debounceNumber, report);
  }

  handleResponse(debounceNumber: number, report: PeriodReport) {
    // Only handle this response if it the last requested.
    if (this.debounceCounter !== debounceNumber) return;

    this.report = report;
    this.loading = false;

    this.netWorthChartOptions = this.getNetWorthChartOptions();
    this.expenseByCategoryChartOptions = this.getByCategoryChartOptions(true);
    this.incomeByCategoryChartOptions = this.getByCategoryChartOptions(false);
  }

  public categoryTitle = (c: Category) => c.description;
  public categoryIcon = Maybe.some((c: Category) => c.icon);
  public categoryChildren = Maybe.some((c: Category) => c.children);

  public selectedCategoriesChanged(cs: Array<Category>) {
    this.selectedCategories = cs;
    this.loadReport();
  }

  changeByCategoryTab(num: number) {
    this.byCategoryTab = num;
  }

  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  private chartCategories(
    map: (_: ITransactionSums) => number,
    maxCount: number,
    categoryMap: Map<number, ITransactionSums>,
    colors: Array<string>
  ) {
    let sortedCategories = Array.from(categoryMap)
      .map(([catId, sums]) => {
        return { catId: catId, sums: sums };
      })
      .sort((a, b) => map(b.sums) - map(a.sums));

    let canAddAll = maxCount >= sortedCategories.length;

    let toShow: Array<CategoryToShow> = [];
    // Add all categories if they fit, or leave 1 place for the grouped categories.
    for (let i; canAddAll || i < maxCount; i++) {
      let cat = sortedCategories[i];
      if (!cat) break;

      toShow.push({
        categoryId: Maybe.some(cat.catId),
        name: this.report.categories[cat.catId].description,
        color: colors[i],
        value: map(cat.sums),
      });
    }

    // Group the remaining categories
    if (!canAddAll) {
      let toGroup = sortedCategories.splice(toShow.length);
      let total = toGroup.reduce((sum, c) => sum + map(c.sums), 0);
      toShow.push({
        categoryId: Maybe.none(),
        name: "Other",
        color: colors[toShow.length],
        value: total,
      });
    }

    return toShow;
  }

  private expenseChartOption() {
    // TODO:: EChartOption {
    let colors = ["#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"];
    this.shuffleArray(colors);

    let totalExpenses = this.report.totals.expense;
    let rootCategories = this.chartCategories(s => s.expense, 9, this.report.totalsPerRootCategory, colors);
    let rootCategoryIds = rootCategories.filter(c => c.categoryId.isSome).map(c => c.categoryId.value);

    let childCategories: Array<CategoryToShow> = [];
    rootCategories.forEach(c => {});
    // TODO
  }

  private getNetWorthChartOptions(): EChartOption {
    return {
      color: ["#598bff"],
      tooltip: {
        trigger: "axis",
        formatter: (i: any) => `${this.datePipe.transform(i[0].name, "dd-MM-yyyy")}: ${this.currencyPipe.transform(i[0].value, "EUR")}`,
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
            formatter: v => `${this.datePipe.transform(v, "dd-MM-yyyy")}`,
          },
          data: Array.from(this.report.dailyNetWorth.keys()).map(d => d.toISOString()),
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            formatter: v => `${this.currencyPipe.transform(v, "EUR", "symbol", "1.0-0")}`,
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

  private getByCategoryChartOptions(expense: boolean): EChartOption {
    const rootColors = ["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff", "#00bfa0"];

    let outerColors: string[] = [];
    let innerColors: string[] = [];
    let outerData: RootCategory[] = [];
    let innerData: ChildCategory[] = [];

    let categoriesToShow: RootCategory[] = [];

    if (expense && this.report.totals.expense === 0) return;
    if (!expense && this.report.totals.income === 0) return;

    // Sort the categories in descending order
    let sortedCategories = Array.from(this.report.totalsPerRootCategory)
      .sort((a, b) => (expense ? b[1].expense - a[1].expense : b[1].income - a[1].income))
      .map(x => {
        return { id: x[0], sums: x[1] };
      });

    // The categories which are too small to see will be grouped
    let categoriesToGroup: { id: number; sums: ITransactionSums }[] = [];

    for (let i = 0; i < sortedCategories.length; i++) {
      let category = sortedCategories[i];
      let angle = (expense ? category.sums.expense / this.report.totals.expense : category.sums.income / this.report.totals.income) * 360;

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
        groupedCategories: categoriesToGroup.map(c => {
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

    return {
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
              let amount = expense ? this.rootCategorySums(category).expense : this.rootCategorySums(category).income;
              let percentage = amount / (expense ? this.report.totals.expense : this.report.totals.income);

              let currencyPipe = new CurrencyPipe("nl-NL");
              let percentPipe = new PercentPipe("nl-NL");

              switch (category.type) {
                case RootCategoryType.Normal:
                  return `<div class='chart-tooltip'>
                    <span class='tooltip-header'>${name}</span>
                    <div>${currencyPipe.transform(amount, "EUR")} (${percentPipe.transform(percentage)})</div>
                    </div>`;
                case RootCategoryType.Other:
                  let otherCategory = category as OtherRootCategory;

                  let categoriesWithExpenes = otherCategory.groupedCategories.filter(
                    c => (expense && c.sums.expense > 0) || (!expense && c.sums.income > 0)
                  );

                  let tooltip = `<div class='chart-tooltip'>
                    <span class='tooltip-header'>${categoriesWithExpenes.length + " categories"}</span>
                    <div>${currencyPipe.transform(amount, "EUR")} (${percentPipe.transform(percentage)})</div>`;

                  for (let i = 0; i < categoriesWithExpenes.length; i++) {
                    let c = categoriesWithExpenes[i];
                    let p = expense ? c.sums.expense / this.report.totals.expense : c.sums.income / this.report.totals.income;
                    tooltip += `<div>${c.name.trim()}: ${currencyPipe.transform(
                      expense ? c.sums.expense : c.sums.income,
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
          data: outerData.map(c => {
            return {
              name: `${this.rootCategoryName(c)}`,
              value: expense ? this.rootCategorySums(c).expense : this.rootCategorySums(c).income,
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
              let amount = expense ? this.childCategorySums(category).expense : this.childCategorySums(category).income;
              let percentage = amount / (expense ? this.report.totals.expense : this.report.totals.income);

              let currencyPipe = new CurrencyPipe("nl-NL");
              let percentPipe = new PercentPipe("nl-NL");

              switch (category.type) {
                case ChildCategoryType.Normal:
                  return `<div class='chart-tooltip'>
                    <span class='tooltip-header'>${name}</span>
                    <div>${currencyPipe.transform(amount, "EUR")} (${percentPipe.transform(percentage)})</div>
                    </div>`;
                case ChildCategoryType.Other:
                  let otherCategory = category as OtherChildCategory;

                  let categoriesWithExpenes = otherCategory.groupedCategories.filter(c => (expense ? c.sums.expense : c.sums.income) > 0);

                  let tooltip = `<div class='chart-tooltip'>
                    <span class='tooltip-header'>${categoriesWithExpenes.length + " categories"}</span>
                    <div>${currencyPipe.transform(amount, "EUR")} (${percentPipe.transform(percentage)})</div>`;

                  for (let i = 0; i < categoriesWithExpenes.length; i++) {
                    let c = categoriesWithExpenes[i];
                    if (c.sums.expense > 0) {
                      let p = expense ? c.sums.expense / this.report.totals.expense : c.sums.income / this.report.totals.income;
                      tooltip += `<div>${c.name.trim()}: ${currencyPipe.transform(
                        expense ? c.sums.expense : c.sums.income,
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
                    <div>${currencyPipe.transform(amount, "EUR")} (${percentPipe.transform(percentage)})</div></div>`;
              }
            },
          },
          label: { show: false },
          data: innerData.map(c => {
            return {
              name: `${c.parentName} -> ${c.name}`,
              value: expense ? this.childCategorySums(c).expense : this.childCategorySums(c).income,
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
      Array.from(childCategories).map(x => [Maybe.some(x[0]), x[1]])
    );

    // Sort the categories in descending order
    let categories = Array.from(childCategoriesWithRemaining).map(x => {
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
        groupedCategories: categoriesToGroup.map(c => {
          return {
            name: c.id.map(cId => categoryMap.get(cId).description).valueOrElse("Parent"),
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
      let color = category.type === ChildCategoryType.Implicit ? rootCategory.color : ColorUtils.lighten(rootCategory.color, percentage);

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
