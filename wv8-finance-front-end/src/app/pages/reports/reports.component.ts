import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbCalendarRange, NbDateService } from "@nebular/theme";
import { Maybe } from "@wv8/typescript.core";
import { EChartOption } from "echarts";
import { ITransactionSums, ReportData } from "../../@core/data/report";
import { Category } from "../../@core/models/category.model";
import { ChartTooltip } from "../../@core/models/chart-tooltip/chart-tooltip.model";
import { PeriodReport } from "../../@core/models/period-report.model";
import { CategoryService } from "../../@core/services/category.service";
import { ColorUtils } from "../../@core/utils/color-utils";

type ChildCategories = Map<number, ITransactionSums>;
type OtherCategoriesData = {
  sums: ITransactionSums;
  children: ChildCategories;
};

type CategoryData = {
  parentName: Maybe<string>;
  name: string;
  groupedNames: string[];
  sums: ITransactionSums;
};

type ChildCategoryData = {
  color: string;
  data: CategoryData;
};

@Component({
  selector: "reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  loading: boolean = false;
  debounceCounter: number = 0;

  report: PeriodReport = null;

  period: NbCalendarRange<Date>;

  netWorthChartOptions: EChartOption;
  byCategoryChartOptions: EChartOption;

  constructor(
    private reportService: ReportData,
    private dateService: NbDateService<Date>,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let monthStart = this.dateService.getMonthStart(today);

    this.period = {
      start: this.dateService.addMonth(monthStart, -1),
      end: this.dateService.addDay(monthStart, -1),
    };
  }

  ngOnInit() {}

  periodSet(period: NbCalendarRange<Date>) {
    this.period = period;
    this.loadReport();
  }

  async loadReport() {
    let debounceNumber = ++this.debounceCounter;
    this.loading = true;
    var report = await this.reportService.getPeriodReport(this.period.start, this.period.end);
    this.handleResponse(debounceNumber, report);
  }

  handleResponse(debounceNumber: number, report: PeriodReport) {
    // Only handle this response if it the last requested.
    if (this.debounceCounter !== debounceNumber) return;
    this.report = report;
    this.loading = false;

    this.setNetWorthChartOptions();
    this.setByTimeIntervalChartOptions();
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

  private setByTimeIntervalChartOptions() {
    const maxNumberOfRootCategories = 9;
    const minPercentageToShow = 10;
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
    let outerData: CategoryData[] = [];
    let innerData: CategoryData[] = [];

    let categories = Array.from(this.report.totalsPerRootCategory).sort(
      (a, b) => b[1].expense - a[1].expense
    );

    let categoriesToShow: [number, ITransactionSums, ChildCategories][] = [];
    let otherCategories: [number, ITransactionSums, ChildCategories][] = [];
    for (let i = 0; i < categories.length; i++) {
      let [categoryId, categorySums] = categories[i];
      let childCategories = this.report.totalsPerChildCategory.get(categoryId);
      if ((categorySums.expense / this.report.totals.expense) * 100 < minPercentageToShow) {
        otherCategories.push([categoryId, categorySums, childCategories]);
      } else {
        categoriesToShow.push([categoryId, categorySums, childCategories]);
      }
    }

    if (otherCategories.length > 0) {
      let othersData: OtherCategoriesData = otherCategories.reduce(
        (prev: OtherCategoriesData, current) => {
          return {
            sums: {
              expense: prev.sums.expense + current[1].expense,
              income: prev.sums.income + current[1].income,
            },
            children: new Map([...prev.children, ...current[2]]),
          };
        },
        { sums: { expense: 0, income: 0 }, children: new Map() }
      );

      categoriesToShow.push([-1, othersData.sums, othersData.children]);
    }

    for (let i = 0; i < categoriesToShow.length; i++) {
      let [categoryId, categorySum, childCategories] = categoriesToShow[i];
      let color = rootColors[i];

      let categoryName =
        categoryId == -1
          ? this.uniqueCategoryName("Other", i)
          : this.report.categories.get(categoryId).description;

      outerColors.push(color);
      // TODO: Add category id to data such that click handler can do something for specific category
      outerData.push({
        parentName: Maybe.none(),
        name: categoryName,
        groupedNames: [],
        sums: categorySum,
      });

      let childCategoriesData = this.getInnerData(
        { color: color, name: categoryName, number: i },
        childCategories,
        this.report.categories
      );
      let remaining = childCategoriesData.reduce(
        (prev, current) => {
          return {
            expense: prev.expense - current.data.sums.expense,
            income: prev.income - current.data.sums.income,
          };
        },
        { expense: categorySum.expense, income: categorySum.income }
      );
      if (remaining.expense > 0) {
        // Categories with the same name share the same color. We don't want this.
        let parentName = this.uniqueCategoryName("Parent", i);
        childCategoriesData = [
          {
            color: color,
            data: {
              parentName: Maybe.some(parentName),
              name: parentName,
              groupedNames: [],
              sums: remaining,
            },
          },
          ...childCategoriesData,
        ];
      }

      for (let j = 0; j < childCategoriesData.length; j++) {
        innerColors.push(childCategoriesData[j].color);
        innerData.push(childCategoriesData[j].data);
      }
    }
    this.byCategoryChartOptions = {
      color: outerColors.concat(innerColors),
      tooltip: {
        trigger: "item",
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
              // Normal: show parent data
              // Other: show all grouped categories, including percentages
              return "";
            },
          },
          label: {
            color: "white",
            position: "inside",
            textBorderColor: "black",
            textBorderWidth: 2,
            fontSize: 16,
          },
          data: outerData.map((d) => {
            return {
              name: d.name,
              value: d.sums.expense,
              data: d,
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
              // Normal: show parent data + child data
              // Parent: explain that no child category is selected
              // Other: show all grouped categories, including percentages
              return "";
            },
          },
          label: {
            color: "white",
            position: "inside",
            textBorderColor: "black",
            textBorderWidth: 2,
            fontSize: 12,
          },
          data: innerData.map((d) => {
            return {
              name: d.name,
              value: d.sums.expense,
              data: d,
            };
          }),
        },
      ],
    };
  }

  private getInnerData(
    rootCategory: { color: string; name: string; number: number },
    childCategories: ChildCategories,
    categoryMap: Map<number, Category>
  ): ChildCategoryData[] {
    const minPercentageToShow = 0;

    if (!childCategories) return [];

    let categories = Array.from(childCategories).sort((a, b) => b[1].expense - a[1].expense);

    let categoriesToShow: [number, ITransactionSums, string[]][] = [];
    let otherCategories = [];
    for (let i = 0; i < categories.length; i++) {
      let [categoryId, categorySums] = categories[i];
      if ((categorySums.expense / this.report.totals.expense) * 100 < minPercentageToShow) {
        otherCategories.push(categories[i]);
      } else {
        categoriesToShow.push([categoryId, categorySums, []]);
      }
    }

    if (otherCategories.length > 0) {
      let othersSum: ITransactionSums = otherCategories.reduce(
        (prev: ITransactionSums, current) => {
          return {
            expense: prev.expense + current[1].expense,
            income: prev.income + current[1].income,
          };
        },
        { expense: 0, income: 0 }
      );

      let otherCategoryNames = otherCategories.map((cId) => categoryMap.get(cId).description);
      categoriesToShow.push([-1, othersSum, otherCategoryNames]);
    }

    let numberOfChildCategories = categoriesToShow.length;
    let lightenStep = 30 / (numberOfChildCategories + 1);

    let data: ChildCategoryData[] = [];

    for (let i = 0; i < numberOfChildCategories; i++) {
      let [categoryId, categorySum, groupedNames] = categoriesToShow[i];
      let percentage = lightenStep * (i + 1);
      let color = ColorUtils.colorShade(rootCategory.color, percentage);

      data.push({
        color: color,
        data: {
          name:
            categoryId == -1
              ? this.uniqueCategoryName("Other", rootCategory.number)
              : categoryMap.get(categoryId).description,
          parentName: Maybe.some(rootCategory.name),
          groupedNames: groupedNames,
          sums: categorySum,
        },
      });
    }

    return data;
  }

  private uniqueCategoryName(name, number) {
    return name + " ".repeat(number);
  }
}
