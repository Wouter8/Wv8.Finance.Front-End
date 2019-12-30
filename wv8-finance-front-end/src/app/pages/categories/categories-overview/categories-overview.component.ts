import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from '../../../@theme/components/table/table.component';
import { ICategory, CategoryData } from '../../../@core/data/category';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { CreateOrEditCategoryComponent } from '../create-or-edit-category/create-or-edit-category.component';
import { Category } from '../../../@core/models/category.model';
import { CustomTableSettings } from '../../../@theme/components/table/table-settings.model';
import { TableIconCellComponent } from '../../../@theme/components/table/table-icon-cell/table-icon-cell.component';
import { TableDefaultAndObsoleteCellComponent } from '../../../@theme/components/table/table-default-and-obsolete-cell/table-default-and-obsolete-cell.component';
import { TableEuroCellComponent } from '../../../@theme/components/table/table-euro-cell/table-euro-cell.component';
import { TableObsoleteCellComponent } from '../../../@theme/components/table/table-obsolete-cell/table-obsolete-cell.component';
import { TableNameCellComponent } from '../../../@theme/components/table/table-name-cell/table-name-cell.component';

@Component({
  selector: 'categories-overview',
  templateUrl: './categories-overview.component.html',
  styleUrls: ['./categories-overview.component.scss']
})
export class CategoriesOverviewComponent implements OnInit {
  @ViewChild("table", { static: true })
  table: TableComponent<ICategory>;
  categories: ICategory[] = [];

  showObsolete: boolean = false;

  constructor(
    private categorieservice: CategoryData,
    private router: Router,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService
  ) {}

  ngOnInit() {
    this.table.setSettings(this.getTableSettings());
    this.loadData(this.showObsolete);
  }

  onShowObsoleteChange(event: boolean) {
    this.showObsolete = event;
    this.loadData(event);
  }

  onSelect(event: ICategory) {
    this.router.navigateByUrl(`categories/${event.id}`);
  }

  onClickAdd(event: MouseEvent) {
    this.dialogService
      .open(CreateOrEditCategoryComponent)
      .onClose.subscribe((data: { success: boolean; category: Category }) => {
        if (data && data.success) {
          this.categorieservice.createCategory(data.category).subscribe(category => {
            this.categories.push(category);
            this.loadData(this.showObsolete);

            this.toasterService.success("", "Added category");
          });
        }
      });
  }

  private loadData(showObsolete: boolean) {
    this.categorieservice.getCategories(showObsolete).subscribe(categories => {
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
          width: "60px",
        },
        name: {
          title: "Name",
          type: "custom",
          renderComponent: TableNameCellComponent,
          sort: false
        },
      },
      hideFilter: true,
      clickable: true,
      rowClassFunction: (row: ICategory) => {
        let classes: string[] = [];
        if (row.obsolete) {
          classes.push("obsolete");
        }
        return classes;
      }
    };
  }

}
