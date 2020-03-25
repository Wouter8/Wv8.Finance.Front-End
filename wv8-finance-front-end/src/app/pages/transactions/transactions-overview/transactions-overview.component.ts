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
  transactionGroup: TransactionGroup = undefined;

  accounts: Account[] = [];
  transactionTypes = TransactionType;

  descriptionFilter: string = undefined;
  categoryFilter: number = undefined;
  accountFilter: number = undefined;
  rangeFilter: NbCalendarRange<Date> = undefined;
  typeFilter: TransactionType = undefined;

  rowsPerPage: number = 15;

  retrievalFunction = this.filter.bind(this);

  constructor(
    private transactionservice: TransactionData,
    private accountService: AccountData,
    private router: Router,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService,
    private dateService: NbDateService<Date>
  ) {}

  async ngOnInit() {
    let today = new Date();
    this.rangeFilter = {
      start: this.dateService.addDay(today, -21),
      end: this.dateService.addDay(today, 7)
    };
    this.filter();

    this.accounts = await this.accountService.getAccounts(true);
  }

  onClickAdd(event: MouseEvent) {
    this.dialogService
      .open(CreateOrEditTransactionComponent)
      .onClose.subscribe(
        (data: { success: boolean; transaction: Transaction }) => {
          if (data.success) {
            this.transactionGroup.transactions.unshift(data.transaction);

            // Reset to trigger changes in table component.
            this.transactionGroup.transactions = [
              ...this.transactionGroup.transactions
            ];

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
  }

  onSetPeriod(event: NbCalendarRange<Date>) {
    this.rangeFilter = event;
    this.filter();
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
}
