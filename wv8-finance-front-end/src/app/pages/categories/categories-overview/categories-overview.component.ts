import { Component, OnInit, ViewChild } from "@angular/core";
import { TableComponent } from "../../../@theme/components/table/table.component";
import { ICategory, CategoryData } from "../../../@core/data/category";
import { Router } from "@angular/router";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { CreateOrEditCategoryComponent } from "../create-or-edit-category/create-or-edit-category.component";
import { Category } from "../../../@core/models/category.model";
import { CustomTableSettings } from "../../../@theme/components/table/table-settings.model";
import { TableNameCellComponent } from "../../../@theme/components/table/table-name-cell/table-name-cell.component";

@Component({
  selector: "categories-overview",
  templateUrl: "./categories-overview.component.html",
  styleUrls: ["./categories-overview.component.scss"]
})
export class CategoriesOverviewComponent implements OnInit {
  @ViewChild("table", { static: true })
  table: TableComponent<ICategory>;
  categories: ICategory[] = [];

  showObsolete: boolean = false;

  constructor(
    private categoriesService: CategoryData,
    private router: Router,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService
  ) {}

  ngOnInit() {
    this.table.setSettings(this.getTableSettings());
    this.loadData(this.showObsolete);
  }

  onSelect(event: ICategory) {
    this.router.navigateByUrl(`categories/${event.id}`);
  }

  onClickAdd(event: MouseEvent) {
    this.dialogService
      .open(CreateOrEditCategoryComponent)
      .onClose.subscribe((data: { success: boolean; category: Category }) => {
        if (data && data.success) {
          this.categoriesService
            .createCategory(
              data.category.description,
              data.category.type,
              data.category.parentCategoryId,
              data.category.icon.pack,
              data.category.icon.name,
              data.category.icon.color
            )
            .subscribe(category => {
              this.categories.push(category);
              this.table.setData(this.categories);

              this.toasterService.success("", "Added category");
            });
        }
      });
  }

  public loadData(showObsolete: boolean) {
    this.categoriesService.getCategories(showObsolete).subscribe(categories => {
      this.categories = categories;
      this.table.setData(this.categories);
    });
  }

  private getTableSettings(): CustomTableSettings<Category> {
    return {
      columns: {
        id: {
          title: "ID",
          type: "text",
          sort: false,
          width: "60px"
        },
        description: {
          title: "Name",
          type: "custom",
          renderComponent: TableNameCellComponent,
          sort: false
        }
      },
      hideFilter: true,
      clickable: true,
      rowClassFunction: (row: Category) => {
        let classes: string[] = [];
        if (row.isObsolete) {
          classes.push("obsolete");
        }
        return classes;
      }
    };
  }
}
