import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NbCalendarRange, NbDateService } from "@nebular/theme";
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
  name: string;
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

      outerColors.push(color);
      // TODO: Add category id to data such that click handler can do something for specific category
      outerData.push({
        name: categoryId == -1 ? "Other" : this.report.categories.get(categoryId).description,
        sums: categorySum,
      });

      let childCategoriesData = this.getInnerData(color, childCategories, this.report.categories);
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
        childCategoriesData = [
          { color: color, data: { name: "Parent", sums: remaining } },
          ...childCategoriesData,
        ];
      }

      for (let j = 0; j < childCategoriesData.length; j++) {
        console.log(childCategoriesData[j]);
        innerColors.push(childCategoriesData[j].color);
        innerData.push(childCategoriesData[j].data);
      }
    }

    console.log(outerColors, innerColors, outerColors.concat(innerColors));

    this.byCategoryChartOptions = {
      color: outerColors.concat(innerColors),
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
          label: {
            position: "inner",
          },
          data: outerData.map((d) => {
            return {
              name: d.name,
              value: d.sums.expense,
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
          label: {
            position: "inner",
          },
          data: innerData.map((d) => {
            return {
              name: d.name,
              value: d.sums.expense,
            };
          }),
        },
      ],
    };
  }

  private getInnerData(
    rootCategoryColor,
    childCategories: ChildCategories,
    categoryMap: Map<number, Category>
  ): ChildCategoryData[] {
    const minPercentageToShow = 100;

    if (!childCategories) return [];

    console.log(childCategories, Array.from(childCategories));

    let categories = Array.from(childCategories).sort((a, b) => b[1].expense - a[1].expense);

    let categoriesToShow: [number, ITransactionSums][] = [];
    let otherCategories = [];
    for (let i = 0; i < categories.length; i++) {
      let [categoryId, categorySums] = categories[i];
      if ((categorySums.expense / this.report.totals.expense) * 100 < minPercentageToShow) {
        otherCategories.push(categories[i]);
      } else {
        categoriesToShow.push([categoryId, categorySums]);
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

      categoriesToShow.push([-1, othersSum]);
    }

    let numberOfChildCategories = categoriesToShow.length;
    let lightenStep = 30 / (numberOfChildCategories + 1);

    let data: ChildCategoryData[] = [];

    for (let i = 0; i < numberOfChildCategories; i++) {
      console.log(numberOfChildCategories, lightenStep, categories[i]);
      let [categoryId, categorySum] = categoriesToShow[i];
      console.log(categoryId, categoryMap.get(categoryId));
      let percentage = lightenStep * (i + 1);
      let color = ColorUtils.colorShade(rootCategoryColor, percentage);

      data.push({
        color: color,
        data: {
          name: categoryId == -1 ? "Other" : categoryMap.get(categoryId).description,
          sums: categorySum,
        },
      });
    }

    return data;
  }
}
