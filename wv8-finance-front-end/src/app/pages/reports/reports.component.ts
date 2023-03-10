import { CurrencyPipe, DatePipe, PercentPipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";
import { NbCalendarRange, NbDateService } from "@nebular/theme";
import { Maybe } from "@wv8/typescript.core";
import { EChartOption } from "echarts";
import { distinctUntilChanged, filter, skip } from "rxjs/operators";
import { CategoryData } from "../../@core/data/category";
import { ITransactionSums, ReportData } from "../../@core/data/report";
import { Category } from "../../@core/models/category.model";
import { ChartTooltip } from "../../@core/models/chart-tooltip/chart-tooltip.model";
import { PeriodReport } from "../../@core/models/period-report.model";
import { CategoryService } from "../../@core/services/category.service";
import { ColorUtils } from "../../@core/utils/color-utils";
import { getCategoryChartOptions, getNetWorthChartOptions } from "./chart-options";

enum ByCategoryTab {
  Result = 1,
  Expense = 2,
  Income = 3,
}

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

  byCategoryTab: ByCategoryTab = ByCategoryTab.Expense;

  netWorthChartOptions: EChartOption;
  expenseByCategoryChartOptions: EChartOption;
  incomeByCategoryChartOptions: EChartOption;

  constructor(
    private reportService: ReportData,
    private categoryService: CategoryData,
    private dateService: NbDateService<Date>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories(false, true);
    this.route.queryParamMap.subscribe(params => {
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
        let prevYearToday = this.dateService.addYear(today, -1);
        let startPrevYear = this.dateService.getYearStart(prevYearToday);
        let startThisYear = this.dateService.getYearStart(today);
        this.period = {
          start: startPrevYear,
          end: this.dateService.addDay(startThisYear, -1),
        };
      }
      this.loadReport();
      this.initializedFilters = true;
      this.updateQueryParams();
    });
  }

  periodSet(period: NbCalendarRange<Date>) {
    this.period = period;
    this.updateQueryParams();
  }

  private updateQueryParams() {
    let selectedCategoryIds = this.selectedCategories.map(c => c.id);
    let queryParams: Params = {
      periodStart: this.period.start.toDateString(),
      periodEnd: this.period.end.toDateString(),
      catId: selectedCategoryIds.length > 0 ? selectedCategoryIds : null,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      replaceUrl: true,
    });
  }

  async loadReport() {
    let debounceNumber = ++this.debounceCounter;
    this.loading = true;

    let selectedCategoryIds = this.selectedCategories.map(c => c.id);
    var report = await this.reportService.getPeriodReport(this.period.start, this.period.end, selectedCategoryIds);
    this.handleResponse(debounceNumber, report);
  }

  handleResponse(debounceNumber: number, report: PeriodReport) {
    // Only handle this response if it the last requested.
    if (this.debounceCounter !== debounceNumber) return;

    this.report = report;
    this.loading = false;

    this.netWorthChartOptions = getNetWorthChartOptions(this.report);
    this.expenseByCategoryChartOptions = getCategoryChartOptions(s => s.expense, this.report);
    this.incomeByCategoryChartOptions = getCategoryChartOptions(s => s.income, this.report);
  }

  public categoryId = (c: Category) => c.id;
  public categoryTitle = (c: Category) => c.description;
  public categoryIcon = Maybe.some((c: Category) => c.icon);

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
}
