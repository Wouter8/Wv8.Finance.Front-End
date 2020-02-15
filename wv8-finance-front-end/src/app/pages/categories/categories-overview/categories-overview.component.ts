import { Component, OnInit, ViewChild } from "@angular/core";
import { TableComponent } from "../../../@theme/components/table/table.component";
import { ICategory, CategoryData } from "../../../@core/data/category";
import { Router } from "@angular/router";
import {
  NbDialogService,
  NbToastrService,
  NbTreeGridDataService,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbGetters
} from "@nebular/theme";
import { CreateOrEditCategoryComponent } from "../create-or-edit-category/create-or-edit-category.component";
import { Category } from "../../../@core/models/category.model";
import { CustomTableSettings } from "../../../@theme/components/table/table-settings.model";
import { TableNameCellComponent } from "../../../@theme/components/table/table-name-cell/table-name-cell.component";
import { TreeNode } from "../../../@core/models/tree-node.model";

@Component({
  selector: "categories-overview",
  templateUrl: "./categories-overview.component.html",
  styleUrls: ["./categories-overview.component.scss"]
})
export class CategoriesOverviewComponent implements OnInit {
  categoryGrid: TreeNode<Category>[];

  allColumns = ["description"];

  categories: Category[] = [];

  showObsolete: boolean = false;

  constructor(
    private categoriesService: CategoryData,
    private router: Router,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService
  ) {}

  ngOnInit() {
    this.loadData(this.showObsolete);
  }

  async onClickAdd(event: MouseEvent) {
    this.dialogService
      .open(CreateOrEditCategoryComponent)
      .onClose.subscribe(
        async (data: { success: boolean; category: Category }) => {
          if (data && data.success) {
            let category = await this.categoriesService.createCategory(
              data.category.description,
              data.category.type,
              data.category.parentCategoryId,
              data.category.icon.pack,
              data.category.icon.name,
              data.category.icon.color
            );
            if (category.parentCategoryId.isSome) {
              let parent = this.categories.filter(
                c => c.id == category.parentCategoryId.value
              )[0];
              parent.children.push(category);
            } else {
              this.categories.push(category);
            }
            this.setTableData();

            this.toasterService.success("", "Added category");
          }
        }
      );
  }

  openCategory(id: number) {
    this.router.navigateByUrl(`categories/${id}`);
  }

  public async loadData(showObsolete: boolean) {
    this.categories = await this.categoriesService.getCategories(
      showObsolete,
      true
    );
    console.log(this.categories);
    this.setTableData();
  }

  private setTableData() {
    this.categoryGrid = TreeNode.fromCategories(this.categories);
  }
}
