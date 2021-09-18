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
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
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
      color: ["green", "red", "blue"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: report.dates.map((d) => d.toISOString()),
          axisLabel: {
            formatter: (v) => `${this.datePipe.transform(v, "dd-MM-yyyy")}`,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Income",
          type: "bar",
          stack: "1",
          label: {
            show: false,
          },
          data: report.incomes,
        },
        {
          name: "Expenses",
          type: "bar",
          stack: "1",
          label: {
            show: false,
            position: "left",
          },
          data: report.expenses,
        },
        {
          name: "Result",
          type: "line",
          label: {
            show: false,
            position: "inside",
          },
          data: report.results,
        },
      ],
    };
  }
}
