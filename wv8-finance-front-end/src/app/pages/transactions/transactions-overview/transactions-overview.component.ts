import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { TableComponent } from "../../../@theme/components/table/table.component";
import {
  NbRangepickerComponent,
  NbDialogService,
  NbToastrService,
  NbDateService,
  NbCalendarRange,
  NbCalendarViewMode,
} from "@nebular/theme";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Maybe } from "@wv8/typescript.core";
import { Transaction } from "../../../@core/models/transaction.model";
import { TransactionData } from "../../../@core/data/transaction";
import { TransactionGroup } from "../../../@core/models/transaction-group.model";
import { Account } from "../../../@core/models/account.model";
import { TransactionType } from "../../../@core/enums/transaction-type.enum";
import { AccountData } from "../../../@core/data/account";
import { CreateOrEditTransactionComponent } from "../../../@theme/components/create-or-edit-transaction/create-or-edit-transaction.component";

@Component({
  selector: "transactions-overview",
  templateUrl: "./transactions-overview.component.html",
  styleUrls: ["./transactions-overview.component.scss"],
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

  pageNumber: number = 1;
  rowsPerPage: number = 15;

  retrievalFunction = this.filter.bind(this);

  constructor(
    private transactionservice: TransactionData,
    private accountService: AccountData,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService,
    private dateService: NbDateService<Date>
  ) {}

  async ngOnInit() {
    this.accounts = await this.accountService.getAccounts(true, Maybe.none());
    this.route.queryParams.subscribe((params) => {
      if (params.periodStart && params.periodEnd) {
        this.rangeFilter = {
          start: new Date(params.periodStart),
          end: new Date(params.periodEnd),
        };
      }
      if (params.account) this.accountFilter = params.accountFilter;
      if (params.category) this.categoryFilter = params.category;
      if (params.description) this.descriptionFilter = params.description;
      if (params.type) this.typeFilter = params.type;
      if (params.page) this.pageNumber = params.page;
      // TODO: Filter components are not propertly updated if set by the lines above (UI does not reflect the value)
    });
    this.loadData();
  }

  onClickAdd(event: MouseEvent) {
    this.dialogService
      .open(CreateOrEditTransactionComponent)
      .onClose.subscribe((data: { success: boolean; transaction: Transaction }) => {
        if (data.success) {
          this.transactionGroup.transactions.unshift(data.transaction);

          // Reset to trigger changes in table component.
          this.transactionGroup.transactions = [...this.transactionGroup.transactions];

          this.toasterService.success("", "Added transaction");
        }
      });
  }

  private setQueryParameters() {
    let queryParams: Params = {};
    if (this.rangeFilter && this.rangeFilter.start && this.rangeFilter.end) {
      queryParams.periodStart = this.rangeFilter.start.toDateString();
      queryParams.periodEnd = this.rangeFilter.end.toDateString();
    }
    if (this.accountFilter) queryParams.account = this.accountFilter;
    if (this.categoryFilter) queryParams.category = this.categoryFilter;
    if (this.descriptionFilter) queryParams.description = this.descriptionFilter;
    if (this.typeFilter) queryParams.type = this.typeFilter;
    queryParams.page = this.pageNumber; // TODO: Hashtag instead of query param?

    this.router.navigate([], { relativeTo: this.route, queryParams: queryParams });
  }

  async setPageNumber(newPageNumber) {
    this.pageNumber = newPageNumber;
    await this.filter();
  }

  async filter() {
    this.pageNumber = 1;
    this.descriptionFilter =
      this.descriptionFilter && this.descriptionFilter.trim().length > 0
        ? this.descriptionFilter.trim()
        : undefined;
    await this.loadData();
  }

  onSetPeriod(event: NbCalendarRange<Date>) {
    this.rangeFilter = event;
    this.filter();
  }

  private async loadData() {
    this.setQueryParameters();
    let range = {
      start: undefined,
      end: undefined,
    };
    if (this.rangeFilter && this.rangeFilter.start && this.rangeFilter.end) {
      range.start = this.rangeFilter.start;
      range.end = this.rangeFilter.end;
    }
    this.transactionGroup = await this.transactionservice.getTransactionsByFilter(
      new Maybe(this.typeFilter),
      new Maybe(this.accountFilter),
      new Maybe(this.descriptionFilter),
      new Maybe(this.categoryFilter),
      new Maybe(range.start),
      new Maybe(range.end),
      (this.pageNumber - 1) * this.rowsPerPage,
      this.rowsPerPage
    );
  }
}
