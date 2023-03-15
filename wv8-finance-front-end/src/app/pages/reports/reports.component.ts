import { CurrencyPipe, DatePipe, PercentPipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";
import { NbCalendarRange, NbDateService, NbToastrService } from "@nebular/theme";
import { IMaybe, Maybe } from "@wv8/typescript.core";
import { EChartOption, ECharts } from "echarts";
import { distinctUntilChanged, filter, skip } from "rxjs/operators";
import { CategoryData } from "../../@core/data/category";
import { ITransactionSums, ReportData } from "../../@core/data/report";
import { IntervalUnit } from "../../@core/enums/interval-unit";
import { ReportIntervalUnit } from "../../@core/enums/report-interval-unit.enum";
import { Category } from "../../@core/models/category.model";
import { ChartTooltip } from "../../@core/models/chart-tooltip/chart-tooltip.model";
import { PeriodReport } from "../../@core/models/period-report.model";
import { CategoryService } from "../../@core/services/category.service";
import { ColorUtils } from "../../@core/utils/color-utils";
import {
  BarChartCategory,
  BarChartChildCategory,
  getCategoryChartOptions,
  getCategoryResultChartOptions,
  getIntervalChartOptions,
  getNetWorthChartOptions,
  GroupedCategory,
  PieChartCategory,
} from "./chart-options";

enum ByCategoryTab {
  Combined = 1,
  Separate = 2,
}

type MaybeClick<T> = {
  isSomeField: boolean;
  valueField: T;
};

const maybeClickToMaybe = <T>(maybeClick: MaybeClick<T>): Maybe<T> =>
  Maybe.deserialize({ isSome: maybeClick.isSomeField, value: maybeClick.valueField });

type GroupedCategoryClick = {
  id: string;
  name: string;
  value: number;
  percentage: number;
};

type PieChartCategoryClick = {
  categoryId: MaybeClick<string>;
  name: string;
  title: string;
  color: string;
  value: number;
  percentage: number;
  parentTitle?: string;
  groupingCategories: Array<GroupedCategoryClick>;
};

@Component({
  selector: "reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  loading: boolean = false;
  debounceCounter: number = 0;

  today: Date = new Date();
  period: NbCalendarRange<Date>;
  selectedCategories: Array<Category> = [];
  initializedFilters: boolean = false;

  report: PeriodReport = null;
  categories: Array<Category> = null;
  flatCategories: Array<Category> = null;

  byCategoryTab: ByCategoryTab = ByCategoryTab.Combined;

  netWorthChartOptions: EChartOption;
  intervalChartOptions: EChartOption;
  expenseByCategoryChartOptions: EChartOption;
  incomeByCategoryChartOptions: EChartOption;
  resultByCategoryChartOptions: EChartOption;

  constructor(
    private reportService: ReportData,
    private categoryService: CategoryData,
    private dateService: NbDateService<Date>,
    private toasterService: NbToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories(false, true);
    this.flatCategories = this.categories.concat(...this.categories.map(c => c.children));
    this.route.queryParamMap.subscribe(params => {
      if (params.has("catId")) {
        let catIds = params.getAll("catId").map(id => parseInt(id));
        this.selectedCategories = this.flatCategories.filter(c => catIds.includes(c.id));
      } else {
        this.selectedCategories = [];
      }

      if (params.has("periodStart") && params.has("periodEnd")) {
        this.period = {
          start: new Date(params.get("periodStart")),
          end: new Date(params.get("periodEnd")),
        };
      } else {
        this.setInitialPeriod();
        this.updateQueryParams();
        return;
      }
      this.loadReport();

      this.initializedFilters = true;
    });
  }

  setInitialPeriod() {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    let prevYearToday = this.dateService.addYear(today, -1);
    let startPrevYear = this.dateService.getYearStart(prevYearToday);
    let startThisYear = this.dateService.getYearStart(today);
    this.period = {
      start: startPrevYear,
      end: this.dateService.addDay(startThisYear, -1),
    };
  }

  periodSet(period: NbCalendarRange<Date>) {
    this.period = period;
    this.updateQueryParams();
  }

  private updateQueryParams(addHistory: boolean = false) {
    let selectedCategoryIds = this.selectedCategories.map(c => c.id);
    let queryParams: Params = {
      periodStart: this.period.start.toDateString(),
      periodEnd: this.period.end.toDateString(),
      catId: selectedCategoryIds.length > 0 ? selectedCategoryIds : null,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: !addHistory,
    });
  }

  async loadReport() {
    let debounceNumber = ++this.debounceCounter;
    this.loading = true;

    let selectedCategoryIds = this.selectedCategories.map(c => c.id);

    try {
      var report = await this.reportService.getPeriodReport(this.period.start, this.period.end, selectedCategoryIds);
      this.handleResponse(debounceNumber, report);
    } catch (e) {
      // Reset the filters since something might be set up wrong
      this.selectedCategories = [];
      this.setInitialPeriod();
      this.updateQueryParams();
    }
  }

  handleResponse(debounceNumber: number, report: PeriodReport) {
    // Only handle this response if it the last requested.
    if (this.debounceCounter !== debounceNumber) return;

    this.report = report;
    this.loading = false;

    this.netWorthChartOptions = getNetWorthChartOptions(this.report);
    this.intervalChartOptions = getIntervalChartOptions(this.report);
    this.expenseByCategoryChartOptions = getCategoryChartOptions(s => s.expense, this.report);
    this.incomeByCategoryChartOptions = getCategoryChartOptions(s => s.income, this.report);
    this.resultByCategoryChartOptions = getCategoryResultChartOptions(this.report);
  }

  public categoryId = (c: Category) => c.id;
  public categoryTitle = (c: Category) => c.description;
  public categoryIcon = Maybe.some((c: Category) => c.icon);
  public categoryChildren = Maybe.some((c: Category) => c.children);

  public selectedCategoriesChanged(cs: Array<Category>) {
    this.selectedCategories = cs;
    this.updateQueryParams();
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

  onClickByCategoryPieChart(event) {
    const pointerEvent: PointerEvent = event.event.event;
    const data: PieChartCategoryClick = event.data;

    const categoryIds = maybeClickToMaybe(data.categoryId)
      .map(parseInt)
      .map(i => [i])
      .valueOrElse(data.groupingCategories.map(c => parseInt(c.id)));

    // Remove clicked category from filter
    if (pointerEvent.shiftKey) {
      if (this.selectedCategories.length === 0) {
        this.selectedCategories = [...this.categories];
      }
      this.selectedCategories = [...this.selectedCategories.filter(c => !categoryIds.includes(c.id))];
    } else {
      this.selectedCategories = this.flatCategories.filter(c => categoryIds.includes(c.id));
    }

    this.updateQueryParams(true);
  }

  onClickByCategoryBarChart(event) {
    const pointerEvent: PointerEvent = event.event.event;
    const categoryIds = event.data[2].idsToFilter.map(parseInt);

    // Remove clicked category from filter
    if (pointerEvent.shiftKey) {
      if (this.selectedCategories.length === 0) {
        this.selectedCategories = [...this.categories];
      }
      this.selectedCategories = [...this.selectedCategories.filter(c => !categoryIds.includes(c.id))];
    } else {
      this.selectedCategories = this.flatCategories.filter(c => categoryIds.includes(c.id));
    }

    this.updateQueryParams(true);
  }

  onClickByIntervalChart(event) {
    const pointerEvent: PointerEvent = event.event.event;
    const intervalIndex: number = event.dataIndex;

    const clickedStart = this.report.dates[intervalIndex];
    const clickedEnd = this.dateService.addDay(
      this.report.unit === ReportIntervalUnit.Days
        ? this.dateService.addDay(clickedStart, 1)
        : this.report.unit === ReportIntervalUnit.Weeks
        ? this.dateService.addDay(clickedStart, 7)
        : this.report.unit === ReportIntervalUnit.Months
        ? this.dateService.addMonth(clickedStart, 1)
        : this.dateService.addYear(clickedStart, 1),
      -1
    );

    if (pointerEvent.shiftKey) {
      if (this.report.dates.length === 1) {
        this.setInitialPeriod();
        this.updateQueryParams(true);
        return;
      }

      if (pointerEvent.altKey) {
        // Cut off the range from the end
        this.period.end = this.dateService.addDay(clickedStart, -1);
      } else {
        // Cut off the range from the start
        this.period.start = this.dateService.addDay(clickedEnd, 1);
      }
    } else {
      this.period = { start: clickedStart, end: clickedEnd };
    }

    this.updateQueryParams(true);
  }
}
