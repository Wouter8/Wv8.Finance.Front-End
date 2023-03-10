import { Component, OnInit, ViewChild, Input, OnChanges, Output, EventEmitter } from "@angular/core";
import { Transaction } from "../../../@core/models/transaction.model";
import { TableNameCellComponent } from "../table/table-name-cell/table-name-cell.component";
import { TableDateCellComponent } from "../table/table-date-cell/table-date-cell.component";
import { TableEuroCellComponent } from "../table/table-euro-cell/table-euro-cell.component";
import { TableTransactionTypeIconCellComponent } from "../table/table-transaction-type-icon-cell/table-transaction-type-icon-cell.component";
import { TableComponent } from "../table/table.component";
import { Router } from "@angular/router";
import { TableTransactionAmountCellComponent } from "../table/table-transaction-amount-cell/table-transaction-amount-cell.component";
import { IColumn, IColumns, IColumnType, Settings } from "angular2-smart-table";

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
  @Input() initialPage: number = 1;
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
  @Output() onPageChange = new EventEmitter<number>();

  onPageChangeFunction = this.onPageChange_.bind(this);

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

  async onPageChange_(pageNumber: number) {
    this.table.currentPage = pageNumber;
    this.onPageChange.emit(pageNumber);
    await this.retrievalFunction(pageNumber);
  }

  private setTableData() {
    this.table.setData(this.transactions);
    this.table.totalPages = Math.ceil(this.totalRows / this.rowsPerPage);
  }

  private getTableSettings(): Settings {
    let columns: IColumns = {};
    columns["type"] = {
      title: "",
      type: IColumnType.Custom,
      width: "36px",
      renderComponent: TableTransactionTypeIconCellComponent,
      isSortable: false,
    };

    columns["amount"] = {
      title: "Amount",
      type: IColumnType.Custom,
      renderComponent: TableTransactionAmountCellComponent,
      isSortable: false,
    };
    if (this.showDateColumn) {
      columns["date"] = {
        title: "Date",
        type: IColumnType.Custom,
        renderComponent: TableDateCellComponent,
        isSortable: false,
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
        type: IColumnType.Custom,
        renderComponent: TableNameCellComponent,
        isSortable: false,
        onComponentInitFunction: (instance: TableNameCellComponent<Transaction>) => {
          instance.nameFunction = () =>
            instance.typedData.category.isSome
              ? instance.typedData.category.value.getCompleteName()
              : instance.typedData.receivingAccount.value.description;
          instance.iconFunction = () =>
            instance.typedData.category.isSome ? instance.typedData.category.value.icon : instance.typedData.receivingAccount.value.icon;

          instance.showDefaultIcon = false;
          instance.iconSize = "small";
        },
      };
    }
    if (this.showDescriptionColumn) {
      columns["description"] = {
        title: "Description",
        type: IColumnType.Text,
        isSortable: false,
      };
    }
    if (this.showAccountColumn) {
      columns["accountId"] = {
        title: "Account",
        type: IColumnType.Custom,
        renderComponent: TableNameCellComponent,
        isSortable: false,
        onComponentInitFunction: (instance: TableNameCellComponent<Transaction>) => {
          instance.nameFunction = () => instance.typedData.account.description;
          instance.iconFunction = () => instance.typedData.account.icon;

          instance.showDefaultIcon = false;
          instance.iconSize = "small";
        },
      };
    }

    return {
      columns,
      filter: undefined,
      rowClassFunction: (row: Transaction) => {
        let classes: string[] = [];

        if (this.italicOnUnprocessed && !row.processed) classes.push("obsolete");

        return classes;
      },
      pager: {
        display: true,
        perPage: this.rowsPerPage,
      },
    };
  }
}
