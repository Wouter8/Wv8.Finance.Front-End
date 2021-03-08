import { Component, OnInit, ViewChild, Input, OnChanges } from "@angular/core";
import { CustomTableSettings, Columns } from "../table/table-settings.model";
import { Transaction } from "../../../@core/models/transaction.model";
import { TableNameCellComponent } from "../table/table-name-cell/table-name-cell.component";
import { TableDateCellComponent } from "../table/table-date-cell/table-date-cell.component";
import { TableEuroCellComponent } from "../table/table-euro-cell/table-euro-cell.component";
import { TableTransactionTypeIconCellComponent } from "../table/table-transaction-type-icon-cell/table-transaction-type-icon-cell.component";
import { TableComponent } from "../table/table.component";
import { Router } from "@angular/router";

@Component({
  selector: "transaction-table",
  templateUrl: "./transaction-table.component.html",
  styleUrls: ["./transaction-table.component.scss"],
})
export class TransactionTableComponent implements OnInit, OnChanges {
  @ViewChild("table", { static: true })
  table: TableComponent<Transaction>;

  @Input()
  transactions: Transaction[];
  @Input()
  totalRows: number;
  @Input()
  rowsPerPage: number = 15;
  @Input()
  retrievalFunction: (pageNumber: number) => Promise<void>;
  @Input()
  showAccountColumn: boolean = true;
  @Input()
  showCategoryColumn: boolean = true;
  @Input()
  showDescriptionColumn: boolean = true;
  @Input()
  showDateColumn: boolean = true;
  @Input()
  showDateColumnIcon: boolean = true;
  @Input()
  italicOnUnprocessed: boolean = true;

  onPageChangeFunction = this.onPageChange.bind(this);

  constructor(private router: Router) {}

  ngOnInit() {
    this.table.setSettings(this.getTableSettings());
  }

  ngOnChanges() {
    this.setTableData();
  }

  onSelect(event: Transaction) {
    this.router.navigateByUrl(`transactions/${event.id}`);
  }

  async onPageChange(pageNumber: number) {
    this.table.currentPage = pageNumber;
    await this.retrievalFunction(pageNumber);
  }

  private setTableData() {
    this.table.setData(this.transactions);
    this.table.totalPages = Math.ceil(this.totalRows / this.rowsPerPage);
  }

  private getTableSettings(): CustomTableSettings<Transaction> {
    let columns: Columns = {};
    columns["type"] = {
      title: "",
      type: "custom",
      width: "36px",
      renderComponent: TableTransactionTypeIconCellComponent,
      sort: false,
    };
    columns["personalAmount"] = {
      title: "Amount",
      type: "custom",
      renderComponent: TableEuroCellComponent,
      sort: false,
    };
    if (this.showDateColumn) {
      columns["date"] = {
        title: "Date",
        type: "custom",
        renderComponent: TableDateCellComponent,
        sort: false,
        onComponentInitFunction: (instance: TableDateCellComponent) => {
          instance.showFutureIcon = this.showDateColumnIcon;
          instance.determineIsFuture = () => !instance.rowData.processed;
          instance.futureTooltipText = "Unprocessed";
        },
      };
    }
    if (this.showCategoryColumn) {
      columns["categoryId"] = {
        title: "Category",
        type: "custom",
        renderComponent: TableNameCellComponent,
        sort: false,
        onComponentInitFunction: (
          instance: TableNameCellComponent<Transaction>
        ) => {
          instance.nameFunction = () =>
            instance.typedData.category.isSome
              ? instance.typedData.category.value.getCompleteName()
              : instance.typedData.receivingAccount.value.description;
          instance.iconFunction = () =>
            instance.typedData.category.isSome
              ? instance.typedData.category.value.icon
              : instance.typedData.receivingAccount.value.icon;

          instance.showDefaultIcon = false;
          instance.iconSize = "small";
        },
      };
    }
    if (this.showDescriptionColumn) {
      columns["description"] = {
        title: "Description",
        type: "text",
      };
    }
    if (this.showAccountColumn) {
      columns["accountId"] = {
        title: "Account",
        type: "custom",
        renderComponent: TableNameCellComponent,
        sort: false,
        onComponentInitFunction: (
          instance: TableNameCellComponent<Transaction>
        ) => {
          instance.nameFunction = () => instance.typedData.account.description;
          instance.iconFunction = () => instance.typedData.account.icon;

          instance.showDefaultIcon = false;
          instance.iconSize = "small";
        },
      };
    }

    return {
      columns,
      hideFilter: true,
      clickable: true,
      rowClassFunction: (row: Transaction) => {
        let classes: string[] = [];

        if (this.italicOnUnprocessed && !row.processed)
          classes.push("obsolete");

        return classes;
      },
      pager: {
        display: true,
        perPage: this.rowsPerPage,
      },
    };
  }
}
