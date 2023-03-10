import { Component, OnInit, ViewChild, Input, OnChanges } from "@angular/core";
import { Router } from "@angular/router";
import { TableComponent } from "../table/table.component";
import { Budget } from "../../../@core/models/budget.model";
import { TableNameCellComponent } from "../table/table-name-cell/table-name-cell.component";
import { TableEuroCellComponent } from "../table/table-euro-cell/table-euro-cell.component";
import { TableDateCellComponent } from "../table/table-date-cell/table-date-cell.component";
import { TableProgressCellComponent } from "../table/table-progress-cell/table-progress-cell.component";
import { IColumns, IColumnType, Settings } from "angular2-smart-table";

@Component({
  selector: "budgets-table",
  templateUrl: "./budgets-table.component.html",
  styleUrls: ["./budgets-table.component.scss"],
})
export class BudgetsTableComponent implements OnInit, OnChanges {
  @ViewChild("table", { static: true })
  table: TableComponent<Budget>;

  @Input()
  budgets: Budget[] = [];

  @Input()
  showDates: boolean = true;

  constructor(private router: Router) {}

  onSelect(event: Budget) {
    this.router.navigateByUrl(`budgets/${event.id}`);
  }

  ngOnInit() {
    this.table.setSettings(this.getTableSettings());
  }

  ngOnChanges() {
    this.setBudgetList();
  }

  private setBudgetList() {
    this.table.setData(this.budgets);
  }

  private getTableSettings(): Settings {
    let columns: IColumns = {};
    columns["category"] = {
      title: "Category",
      type: IColumnType.Custom,
      renderComponent: TableNameCellComponent,
      isSortable: false,

      onComponentInitFunction: (instance: TableNameCellComponent<Budget>) => {
        instance.iconSize = "small";
        instance.nameFunction = () => instance.typedData.category.getCompleteName();
        instance.iconFunction = () => instance.typedData.category.icon;
      },
    };
    columns["amount"] = {
      title: "Amount",
      type: IColumnType.Custom,
      renderComponent: TableEuroCellComponent,
      isSortable: false,
    };
    if (this.showDates) {
      columns["startDate"] = {
        title: "Start Date",
        type: IColumnType.Custom,
        renderComponent: TableDateCellComponent,
        isSortable: false,
      };
      columns["endDate"] = {
        title: "End Date",
        type: IColumnType.Custom,
        renderComponent: TableDateCellComponent,
        isSortable: false,
      };
    }
    columns["spentPercentage"] = {
      title: "Spent",
      type: IColumnType.Custom,
      renderComponent: TableProgressCellComponent,
      isSortable: false,
      onComponentInitFunction: (instance: TableProgressCellComponent) => {
        instance.invertStatus = true;
      },
    };
    return {
      columns,
      hideSubHeader: true,
      rowClassFunction: (row: Budget) => {
        let classes: string[] = [];
        return classes;
      },
    };
  }
}
