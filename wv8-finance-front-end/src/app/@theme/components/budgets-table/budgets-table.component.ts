import { Component, OnInit, ViewChild, Input, OnChanges } from "@angular/core";
import { Router } from "@angular/router";
import { TableComponent } from "../table/table.component";
import { Budget } from "../../../@core/models/budget.model";
import { CustomTableSettings, Columns } from "../table/table-settings.model";
import { TableNameCellComponent } from "../table/table-name-cell/table-name-cell.component";
import { TableEuroCellComponent } from "../table/table-euro-cell/table-euro-cell.component";
import { TableDateCellComponent } from "../table/table-date-cell/table-date-cell.component";
import { TableProgressCellComponent } from "../table/table-progress-cell/table-progress-cell.component";

@Component({
  selector: "budgets-table",
  templateUrl: "./budgets-table.component.html",
  styleUrls: ["./budgets-table.component.scss"]
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

  private getTableSettings(): CustomTableSettings<Budget> {
    let columns: Columns = {};
    columns["category"] = {
      title: "Category",
      type: "custom",
      renderComponent: TableNameCellComponent,
      sort: false,

      onComponentInitFunction: (instance: TableNameCellComponent<Budget>) => {
        instance.iconSize = "small";
        instance.nameFunction = () =>
          instance.typedData.category.getCompleteName();
        instance.iconFunction = () => instance.typedData.category.icon;
      }
    };
    columns["amount"] = {
      title: "Amount",
      type: "custom",
      renderComponent: TableEuroCellComponent,
      sort: false
    };
    if (this.showDates) {
      columns["startDate"] = {
        title: "Start Date",
        type: "custom",
        renderComponent: TableDateCellComponent,
        sort: false
      };
      columns["endDate"] = {
        title: "End Date",
        type: "custom",
        renderComponent: TableDateCellComponent,
        sort: false
      };
    }
    columns["spentPercentage"] = {
      title: "Spent",
      type: "custom",
      renderComponent: TableProgressCellComponent,
      sort: false,
      onComponentInitFunction: (instance: TableProgressCellComponent) => {
        instance.invertStatus = true;
      }
    };
    return {
      columns,
      hideFilter: true,
      clickable: true,
      rowClassFunction: (row: Budget) => {
        let classes: string[] = [];
        return classes;
      }
    };
  }
}
