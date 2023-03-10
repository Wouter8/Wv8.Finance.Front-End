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
import { Category } from "../../../@core/models/category.model";
import { CategoryData } from "../../../@core/data/category";

@Component({
  selector: "transactions-overview",
  templateUrl: "./transactions-overview.component.html",
  styleUrls: ["./transactions-overview.component.scss"],
})
export class TransactionsOverviewComponent implements OnInit {
  transactionGroup: TransactionGroup = undefined;

  accounts: Account[] = [];
  categories: Category[] = [];
  flatCategories: Category[] = [];
  transactionTypes = TransactionType;

  descriptionFilter: string = undefined;
  categoryFilter: Category = undefined;
  accountFilter: Account = undefined;
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
    private categoryService: CategoryData,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService,
    private dateService: NbDateService<Date>
  ) {}

  async ngOnInit() {
    this.accounts = await this.accountService.getAccounts(false, Maybe.none());
    this.categories = await this.categoryService.getCategories(false, true);
    this.flatCategories = this.categories.concat(...this.categories.map(c => c.children));
    this.route.queryParamMap.subscribe(params => {
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
      this.accountFilter = params.has("account") ? this.accounts.find(a => a.id === parseInt(params.get("account"))) : undefined;
      this.categoryFilter = params.has("category") ? this.flatCategories.find(c => c.id === parseInt(params.get("category"))) : undefined;
      this.descriptionFilter = params.has("description") ? params.get("description") : undefined;
      this.typeFilter = params.has("type") ? parseInt(params.get("type")) : undefined;
      this.pageNumber = params.has("page") ? parseInt(params.get("page")) : 1;
      // TODO: Filter components are not propertly updated if set by the lines above (UI does not reflect the value)
      this.loadData();
      this.initializedFilters = true;
      this.setQueryParameters();
    });
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
    if (this.accountFilter) queryParams.account = this.accountFilter.id;
    if (this.categoryFilter) queryParams.category = this.categoryFilter.id;
    if (this.descriptionFilter) queryParams.description = this.descriptionFilter;
    if (this.typeFilter) queryParams.type = this.typeFilter;
    queryParams.page = this.pageNumber; // TODO: Hashtag instead of query param?

    this.router.navigate([], { relativeTo: this.route, queryParams: queryParams, replaceUrl: true });
  }

  async setPageNumber(newPageNumber) {
    this.pageNumber = newPageNumber;
  }

  filter(page: number) {
    this.pageNumber = page;
    this.descriptionFilter = this.descriptionFilter && this.descriptionFilter.trim().length > 0 ? this.descriptionFilter.trim() : undefined;
    this.setQueryParameters();
  }

  onSetPeriod(event: NbCalendarRange<Date>) {
    this.rangeFilter = event;
    this.filter(1);
  }

  public debouncedFilter = debounce(this.filter.bind(this));

  private async loadData() {
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
      new Maybe(this.accountFilter?.id),
      new Maybe(this.descriptionFilter),
      new Maybe(this.categoryFilter?.id),
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

  public categoryFilterChanged(categories: Array<Category>) {
    if (categories.length === 1) {
      this.categoryFilter = categories[0];
    } else {
      this.categoryFilter = null;
    }
    this.filter(1);
  }

  public accountFilterChanged(accounts: Array<Account>) {
    if (accounts.length === 1) {
      this.accountFilter = accounts[0];
    } else {
      this.accountFilter = undefined;
    }
    this.filter(1);
  }

  public categoryId = (c: Category) => c.id;
  public categoryTitle = (c: Category) => c.description;
  public categoryIcon = Maybe.some((c: Category) => c.icon);
  public categoryChildren = Maybe.some((c: Category) => c.children);

  public accountId = (a: Account) => a.id;
  public accountTitle = (a: Account) => a.description;
  public accountIcon = Maybe.some((a: Account) => a.icon);
}
