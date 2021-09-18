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

@Component({
  selector: "category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"],
})
export class CategoryComponent implements OnInit {
  category: Category;
  report: CategoryReport;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryData,
    private reportService: ReportData,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService,
    private dateService: NbDateService<Date>
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
}
