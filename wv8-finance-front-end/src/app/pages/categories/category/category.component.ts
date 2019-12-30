import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ICategory, CategoryData } from "../../../@core/data/category";
import { Maybe } from "wv8.typescript.core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { CreateOrEditCategoryComponent } from "../create-or-edit-category/create-or-edit-category.component";
import { Category } from "../../../@core/models/category.model";
import { ConfirmDialogComponent } from "../../../@theme/components/confirm-dialog/confirm-dialog.component";
import { CategoryType } from '../../../@core/enums/category-type';

@Component({
  selector: "category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"]
})
export class CategoryComponent implements OnInit {
  category: Category;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryData,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = new Maybe<number>(params.id);
      if (id.isSome) {
        try {
        this.categoryService
          .getCategory(id.value)
          .subscribe(category => (this.category = category));
        } catch {
          this.toasterService.danger('', 'Category not found');
          this.router.navigateByUrl('/categories');
        }
      }
    });
  }

  onObsoleteClick() {
    if (this.category.obsolete) {
      this.categoryService
        .setCategoryObsolete(this.category.id, false)
        .subscribe(() => {
          this.category.obsolete = false;

          this.toasterService.success('', 'Recovered category');
        });
    } else {
      this.dialogService
        .open(ConfirmDialogComponent, {
          context: { body: `Mark ${this.category.name} obsolete?` }
        })
        .onClose.subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.categoryService.setCategoryObsolete(this.category.id, true).subscribe(() => {
              this.category.obsolete = true;

              this.toasterService.success('', 'Marked category obsolete');
            });
          }
        });
    }
  }

  onEditClick() {
    this.dialogService
      .open(CreateOrEditCategoryComponent, {
        context: { category: this.category }
      })
      .onClose.subscribe((data: { success: boolean; category: Category }) => {
        if (data && data.success) {
          this.categoryService.updateCategory(data.category).subscribe(updated => this.category = updated);

          this.toasterService.success('', 'Updated category');
        }
      });
  }

  getTypeString() {
    return CategoryType.getCategoryTypeString(this.category.type);
  }
}
