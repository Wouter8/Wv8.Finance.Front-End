import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ICategory, CategoryData } from "../../../@core/data/category";
import { Maybe } from "@wv8/typescript.core";
import {
  NbDateService,
  NbDialogService,
  NbToastrService,
} from "@nebular/theme";
import { CreateOrEditCategoryComponent } from "../create-or-edit-category/create-or-edit-category.component";
import { Category } from "../../../@core/models/category.model";
import { ConfirmDialogComponent } from "../../../@theme/components/confirm-dialog/confirm-dialog.component";
import { CategoryReport } from "../../../@core/models/category-report.model";
import { ReportData } from "../../../@core/data/report";
import { EChartOption } from "echarts";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { ChartTooltip } from "../../../@core/models/chart-tooltip/chart-tooltip.model";

@Component({
  selector: "category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
  category: Category;
  report: CategoryReport;

  resultChartOptions: EChartOption;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryData,
    private reportService: ReportData,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService,
    private dateService: NbDateService<Date>,
    private currencyPipe: CurrencyPipe
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      let id = new Maybe<number>(params.id);
      if (id.isSome) {
        try {
          this.category = await this.categoryService.getCategory(id.value);

          let today = new Date();
          let startOfMonth = this.dateService.getMonthStart(today);
          let start = this.dateService.addMonth(startOfMonth, -11);

          this.report = await this.reportService.getCategoryReport(
            id.value,
            start,
            today
          );
          this.resultChartOptions = this.getChartOptions(this.report);
        } catch {
          this.toasterService.danger("", "Category not found");
          this.router.navigateByUrl("/categories");
        }
      }
    });
  }

  async onObsoleteClick() {
    if (this.category.isObsolete) {
      await this.categoryService.setCategoryObsolete(this.category.id, false);

      this.category.isObsolete = false;
      this.toasterService.success("", "Recovered category");
    } else {
      this.dialogService
        .open(ConfirmDialogComponent, {
          context: { body: `Mark ${this.category.description} obsolete?` },
        })
        .onClose.subscribe(async (confirmed: boolean) => {
          if (confirmed) {
            await this.categoryService.setCategoryObsolete(
              this.category.id,
              true
            );

            this.category.isObsolete = true;
            this.toasterService.success("", "Marked category obsolete");
          }
        });
    }
  }

  async onEditClick() {
    this.dialogService
      .open(CreateOrEditCategoryComponent, {
        context: { category: this.category },
      })
      .onClose.subscribe(
        async (data: { success: boolean; category: Category }) => {
          if (data && data.success) {
            this.category = data.category;

            this.toasterService.success("", "Updated category");
          }
        }
      );
  }

  private getChartOptions(report: CategoryReport): EChartOption {
    return {
      color: ["#3BDE67", "#FF6E6E", "#3366ff"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (data) => {
          let date = this.report.dates[data[0].dataIndex].toIntervalTooltip(
            this.report.unit
          );
          let tooltip = ChartTooltip.create(date)
            .addEuroRow(data[0])
            .addEuroRow(data[1]);

          if (report.results.isSome) tooltip.addEuroRow(data[2]);

          return tooltip.render();
        },
      },
      grid: {
        left: "0%",
        right: "0%",
        bottom: "5px",
        top: "5px",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: report.dates.map((d) => d.toIntervalString(this.report.unit)),
        },
      ],
      yAxis: [
        {
          type: "value",
          min: (v) => (v.min === 0 && v.max === 0 ? -60 : null),
          max: (v) => (v.min === 0 && v.max === 0 ? 60 : null),
          axisLabel: {
            formatter: (v) =>
              this.currencyPipe.transform(
                Math.abs(v),
                "EUR",
                "symbol",
                "1.0-0"
              ),
          },
        },
      ],
      series: [
        {
          name: "Income",
          type: "bar",
          stack: "1",
          data: report.incomes,
        },
        {
          name: "Expenses",
          type: "bar",
          stack: "1",
          data: report.expenses,
        },
        {
          name: "Result",
          type: "line",
          data: report.results.valueOrElse([]),
        },
      ],
    };
  }
}
