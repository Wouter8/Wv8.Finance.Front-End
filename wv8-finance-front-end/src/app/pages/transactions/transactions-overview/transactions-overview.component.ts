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
import { debounce } from "../../../@core/utils/debounce";

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
  initializedFilters: boolean = false;

  pageNumber: number = 1;
  rowsPerPage: number = 15;

  debounceCounter: number = 0;

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
    let params = this.route.snapshot.queryParamMap;
    if (params.has("periodStart") && params.has("periodEnd")) {
      this.rangeFilter = {
        start: new Date(params.get("periodStart")),
        end: new Date(params.get("periodEnd")),
      };
    } else {
      this.rangeFilter = {
        start: undefined,
        end: undefined,
      };
    }
    if (params.has("account")) this.accountFilter = parseInt(params.get("account"));
    if (params.has("category")) this.categoryFilter = parseInt(params.get("category"));
    if (params.has("description")) this.descriptionFilter = params.get("description");
    if (params.has("type")) this.typeFilter = parseInt(params.get("type"));
    if (params.has("page")) this.pageNumber = parseInt(params.get("page"));
    this.initializedFilters = true;
    // TODO: Filter components are not propertly updated if set by the lines above (UI does not reflect the value)
    this.loadData();
  }

  onClickAdd(event: MouseEvent) {
    this.dialogService.open(CreateOrEditTransactionComponent).onClose.subscribe((data: { success: boolean; transaction: Transaction }) => {
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

    this.router.navigate([], { relativeTo: this.route, queryParams: queryParams, replaceUrl: true });
  }

  async setPageNumber(newPageNumber) {
    this.pageNumber = newPageNumber;
  }

  async filter(page: number) {
    this.pageNumber = page;
    this.descriptionFilter = this.descriptionFilter && this.descriptionFilter.trim().length > 0 ? this.descriptionFilter.trim() : undefined;
    await this.loadData();
  }

  onSetPeriod(event: NbCalendarRange<Date>) {
    this.rangeFilter = event;
    this.filter(1);
  }

  public debouncedFilter = debounce(this.filter.bind(this));

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

    let debounceNumber = ++this.debounceCounter;
    let response = await this.transactionservice.getTransactionsByFilter(
      new Maybe(this.typeFilter),
      new Maybe(this.accountFilter),
      new Maybe(this.descriptionFilter),
      new Maybe(this.categoryFilter),
      new Maybe(range.start),
      new Maybe(range.end),
      (this.pageNumber - 1) * this.rowsPerPage,
      this.rowsPerPage
    );
    this.handleResponse(debounceNumber, response);
  }

  private handleResponse(debounceNumber: number, response: TransactionGroup) {
    // Only handle this response if it the last requested.
    if (this.debounceCounter !== debounceNumber) return;

    this.transactionGroup = response;
  }
}
