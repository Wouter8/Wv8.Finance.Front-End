import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { TableComponent } from "../../../@theme/components/table/table.component";
import {
  NbRangepickerComponent,
  NbDialogService,
  NbToastrService,
  NbDateService,
  NbCalendarRange
} from "@nebular/theme";
import { Router } from "@angular/router";
import { CreateOrEditTransactionComponent } from "../create-or-edit-transaction/create-or-edit-transaction.component";
import { Maybe } from "wv8.typescript.core";
import { CustomTableSettings } from "../../../@theme/components/table/table-settings.model";
import { TableNameCellComponent } from "../../../@theme/components/table/table-name-cell/table-name-cell.component";
import { TableEuroCellComponent } from "../../../@theme/components/table/table-euro-cell/table-euro-cell.component";
import { TableDateCellComponent } from "../../../@theme/components/table/table-euro-cell copy/table-date-cell.component";
import { TableProgressCellComponent } from "../../../@theme/components/table/table-progress-cell/table-progress-cell.component";
import { Transaction } from "../../../@core/models/transaction.model";
import { TransactionData, ITransaction } from "../../../@core/data/transaction";
import { TransactionGroup } from "../../../@core/models/transaction-group.model";
import { Account } from "../../../@core/models/account.model";
import { TableBooleanCellComponent } from "../../../@theme/components/table/table-boolean-cell/table-boolean-cell.component";
import { TransactionType } from "../../../@core/enums/transaction-type.enum";
import { AccountService } from "../../../@core/services/account.service";
import { AccountData } from "../../../@core/data/account";

@Component({
  selector: "transactions-overview",
  templateUrl: "./transactions-overview.component.html",
  styleUrls: ["./transactions-overview.component.scss"]
})
export class TransactionsOverviewComponent implements OnInit {
  @ViewChild("table", { static: true })
  table: TableComponent<Transaction>;

  @ViewChild("periodPicker", { static: true })
  periodPicker: NbRangepickerComponent<Date>;

  @ViewChild("periodPickerInput", { static: true })
  periodPickerInput: ElementRef<HTMLInputElement>;

  transactionGroup: TransactionGroup = undefined;

  descriptionFilter: string = undefined;
  rangeFilter: NbCalendarRange<Date> = undefined;

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
    let range: NbCalendarRange<Date> = {
      start: this.dateService.addMonth(today, -1),
      end: this.dateService.addMonth(today, 1)
    };
    this.periodPicker.range = range;
    this.rangeFilter = range;
    this.periodPickerInput.nativeElement.value = `${this.dateService.format(
      range.start,
      "d MMM yy"
    )} - ${this.dateService.format(range.end, "d MMM yy")}`;

    this.table.setSettings(this.getTableSettings());
    this.filter();
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
            this.transactionGroup.transactions.push(data.transaction);
            this.setTransactionList();

            this.toasterService.success("", "Added transaction");
          }
        }
      );
  }

  filter() {
    let range = {
      start: undefined,
      end: undefined
    };
    if (this.rangeFilter.start && this.rangeFilter.end) {
      range.start = this.rangeFilter.start;
      range.end = this.rangeFilter.end;
    }
    this.descriptionFilter =
      this.descriptionFilter && this.descriptionFilter.trim().length > 0
        ? this.descriptionFilter.trim()
        : undefined;

    this.loadData(
      Maybe.none(),
      Maybe.none(),
      new Maybe(this.descriptionFilter),
      Maybe.none(),
      new Maybe(range.start),
      new Maybe(range.end)
    );
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
    rangeEnd: Maybe<Date>
  ) {
    this.transactionGroup = await this.transactionservice.getTransactionsByFilter(
      type,
      description,
      categoryId,
      rangeStart,
      rangeEnd,
      0,
      25
    );
    this.setTransactionList();
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
        account: {
          title: "Category",
          type: "custom",
          renderComponent: TableNameCellComponent,
          sort: false,
          onComponentInitFunction: (
            instance: TableNameCellComponent<Transaction>
          ) => {
            instance.nameFunction = () =>
              instance.typedData.category
                .map(c => c.description)
                .valueOrElse("-");
            instance.iconFunction = () =>
              instance.typedData.category
                .map(c => c.icon)
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
            instance.determineIsFuture = () => instance.rowData.settled;
          }
        },
        amount: {
          title: "Amount",
          type: "custom",
          renderComponent: TableEuroCellComponent,
          sort: false
        }
      },
      hideFilter: true,
      clickable: true,
      rowClassFunction: (row: Transaction) => {
        let classes: string[] = [];

        if (!row.settled) classes.push("obsolete");

        return classes;
      }
    };
  }
}
