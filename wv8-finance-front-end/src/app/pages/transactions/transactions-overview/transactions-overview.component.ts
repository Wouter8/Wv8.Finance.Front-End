import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { TableComponent } from "../../../@theme/components/table/table.component";
import {
  NbRangepickerComponent,
  NbDialogService,
  NbToastrService,
  NbDateService,
  NbCalendarRange,
  NbCalendarViewMode
} from "@nebular/theme";
import { Router } from "@angular/router";
import { CreateOrEditTransactionComponent } from "../create-or-edit-transaction/create-or-edit-transaction.component";
import { Maybe } from "@wv8/typescript.core";
import { CustomTableSettings } from "../../../@theme/components/table/table-settings.model";
import { TableNameCellComponent } from "../../../@theme/components/table/table-name-cell/table-name-cell.component";
import { TableEuroCellComponent } from "../../../@theme/components/table/table-euro-cell/table-euro-cell.component";
import { TableDateCellComponent } from "../../../@theme/components/table/table-date-cell/table-date-cell.component";
import { TableProgressCellComponent } from "../../../@theme/components/table/table-progress-cell/table-progress-cell.component";
import { Transaction } from "../../../@core/models/transaction.model";
import { TransactionData, ITransaction } from "../../../@core/data/transaction";
import { TransactionGroup } from "../../../@core/models/transaction-group.model";
import { Account } from "../../../@core/models/account.model";
import { TableBooleanCellComponent } from "../../../@theme/components/table/table-boolean-cell/table-boolean-cell.component";
import { TransactionType } from "../../../@core/enums/transaction-type.enum";
import { AccountService } from "../../../@core/services/account.service";
import { AccountData } from "../../../@core/data/account";
import { TableTransactionTypeIconCellComponent } from "../../../@theme/components/table/table-transaction-type-icon-cell/table-transaction-type-icon-cell.component";

@Component({
  selector: "transactions-overview",
  templateUrl: "./transactions-overview.component.html",
  styleUrls: ["./transactions-overview.component.scss"]
})
export class TransactionsOverviewComponent implements OnInit {
  @ViewChild("table", { static: true })
  table: TableComponent<Transaction>;

  transactionGroup: TransactionGroup = undefined;

  accounts: Account[] = [];
  transactionTypes = TransactionType;

  descriptionFilter: string = undefined;
  categoryFilter: number = undefined;
  accountFilter: number = undefined;
  rangeFilter: NbCalendarRange<Date> = undefined;
  typeFilter: TransactionType = undefined;

  rowsPerPage: number = 15;

  onPageChangeFunction = this.filter.bind(this);

  constructor(
    private transactionservice: TransactionData,
    private accountService: AccountData,
    private router: Router,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService
  ) {}

  async ngOnInit() {
    this.table.setSettings(this.getTableSettings());
    this.filter();

    this.accounts = await this.accountService.getAccounts(true);
  }

  onSelect(event: ITransaction) {
    this.router.navigateByUrl(`transactions/${event.id}`);
  }

  onClickAdd(event: MouseEvent) {
    this.dialogService
      .open(CreateOrEditTransactionComponent)
      .onClose.subscribe(
        (data: { success: boolean; transaction: Transaction }) => {
          if (data.success) {
            this.transactionGroup.transactions.unshift(data.transaction);
            this.setTransactionList();

            this.toasterService.success("", "Added transaction");
          }
        }
      );
  }

  async filter(pageNumber: number = 1) {
    let range = {
      start: undefined,
      end: undefined
    };
    if (this.rangeFilter && this.rangeFilter.start && this.rangeFilter.end) {
      range.start = this.rangeFilter.start;
      range.end = this.rangeFilter.end;
    }
    this.descriptionFilter =
      this.descriptionFilter && this.descriptionFilter.trim().length > 0
        ? this.descriptionFilter.trim()
        : undefined;

    await this.loadData(
      new Maybe(this.typeFilter),
      new Maybe(this.accountFilter),
      new Maybe(this.descriptionFilter),
      new Maybe(this.categoryFilter),
      new Maybe(range.start),
      new Maybe(range.end),
      pageNumber
    );

    this.setTransactionList();
    this.table.totalPages = Math.ceil(
      this.transactionGroup.totalSearchResults / this.rowsPerPage
    );
    this.table.currentPage = pageNumber;
  }

  onSetPeriod(event: NbCalendarRange<Date>) {
    if (event.start && event.end) {
      this.rangeFilter = event;
      this.filter();
    }
  }

  private async loadData(
    type: Maybe<TransactionType>,
    accountId: Maybe<number>,
    description: Maybe<string>,
    categoryId: Maybe<number>,
    rangeStart: Maybe<Date>,
    rangeEnd: Maybe<Date>,
    pageNumber: number
  ) {
    this.transactionGroup = await this.transactionservice.getTransactionsByFilter(
      type,
      accountId,
      description,
      categoryId,
      rangeStart,
      rangeEnd,
      (pageNumber - 1) * this.rowsPerPage,
      this.rowsPerPage
    );
  }

  private setTransactionList() {
    this.table.setData(this.transactionGroup.transactions);
  }

  private getTableSettings(): CustomTableSettings<Transaction> {
    return {
      columns: {
        accountId: {
          title: "Account",
          type: "custom",
          renderComponent: TableNameCellComponent,
          sort: false,
          onComponentInitFunction: (
            instance: TableNameCellComponent<Transaction>
          ) => {
            instance.nameFunction = () =>
              instance.typedData.account.description;
            instance.iconFunction = () => instance.typedData.account.icon;

            instance.showDefaultIcon = false;
            instance.iconSize = "small";
          }
        },
        categoryId: {
          title: "Category",
          type: "custom",
          renderComponent: TableNameCellComponent,
          sort: false,
          onComponentInitFunction: (
            instance: TableNameCellComponent<Transaction>
          ) => {
            instance.nameFunction = () =>
              instance.typedData.category
                .map(c => c.getCompleteName())
                .valueOrElse("-");
            instance.iconFunction = () =>
              instance.typedData.category
                .map(c => c.icon)
                .valueOrElse(undefined);

            instance.showDefaultIcon = false;
            instance.iconSize = "small";
          }
        },
        receivingAccountId: {
          title: "Receiver",
          type: "custom",
          renderComponent: TableNameCellComponent,
          sort: false,
          onComponentInitFunction: (
            instance: TableNameCellComponent<Transaction>
          ) => {
            instance.nameFunction = () =>
              instance.typedData.receivingAccount
                .map(a => a.description)
                .valueOrElse("-");
            instance.iconFunction = () =>
              instance.typedData.receivingAccount
                .map(a => a.icon)
                .valueOrElse(undefined);

            instance.showDefaultIcon = false;
            instance.iconSize = "small";
          }
        },
        description: {
          title: "Description",
          type: "text"
        },
        date: {
          title: "Date",
          type: "custom",
          renderComponent: TableDateCellComponent,
          sort: false,
          onComponentInitFunction: (instance: TableDateCellComponent) => {
            instance.showFutureIcon = true;
            instance.determineIsFuture = () => !instance.rowData.processed;
            instance.futureTooltipText = "Unprocessed";
          }
        },
        amount: {
          title: "Amount",
          type: "custom",
          renderComponent: TableEuroCellComponent,
          sort: false
        },
        type: {
          title: "Type",
          type: "custom",
          renderComponent: TableTransactionTypeIconCellComponent,
          sort: false
        }
      },
      hideFilter: true,
      clickable: true,
      rowClassFunction: (row: Transaction) => {
        let classes: string[] = [];

        if (!row.processed) classes.push("obsolete");

        return classes;
      },
      pager: {
        display: true,
        perPage: this.rowsPerPage
      }
    };
  }
}
