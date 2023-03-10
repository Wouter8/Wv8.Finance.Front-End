import { Component, OnInit, ViewChild } from "@angular/core";
import { RecurringTransaction } from "../../../../@core/models/recurring-transaction.model";
import { TableComponent } from "../../../../@theme/components/table/table.component";
import { RecurringTransactionData } from "../../../../@core/data/recurring-transaction";
import { Router } from "@angular/router";
import { NbDialogService, NbToastrService, NbCalendarRange } from "@nebular/theme";
import { Transaction } from "../../../../@core/models/transaction.model";
import { Maybe } from "@wv8/typescript.core";
import { TransactionType } from "../../../../@core/enums/transaction-type.enum";
import { TableNameCellComponent } from "../../../../@theme/components/table/table-name-cell/table-name-cell.component";
import { TableDateCellComponent } from "../../../../@theme/components/table/table-date-cell/table-date-cell.component";
import { TableEuroCellComponent } from "../../../../@theme/components/table/table-euro-cell/table-euro-cell.component";
import { TableTransactionTypeIconCellComponent } from "../../../../@theme/components/table/table-transaction-type-icon-cell/table-transaction-type-icon-cell.component";
import { CreateOrEditRecurringTransactionComponent } from "../create-or-edit-recurring-transaction/create-or-edit-recurring-transaction.component";
import { TableMaybeDateCellComponent } from "../../../../@theme/components/table/table-maybe-date-cell/table-maybe-date-cell.component";
import { TableTransactionAmountCellComponent } from "../../../../@theme/components/table/table-transaction-amount-cell/table-transaction-amount-cell.component";
import { IColumnType, Settings } from "angular2-smart-table";

@Component({
  selector: "recurring-transactions-overview",
  templateUrl: "./recurring-transactions-overview.component.html",
  styleUrls: ["./recurring-transactions-overview.component.scss"],
})
export class RecurringTransactionsOverviewComponent implements OnInit {
  @ViewChild("table", { static: true })
  table: TableComponent<RecurringTransaction>;

  recurringTransactions: RecurringTransaction[] = [];

  loadFinished: boolean = false;

  constructor(
    private recurringTransactionService: RecurringTransactionData,
    private router: Router,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService
  ) {}

  async ngOnInit() {
    this.table.setSettings(this.getTableSettings());
    this.loadData();
  }

  onSelect(event: RecurringTransaction) {
    this.router.navigateByUrl(`transactions/recurring/${event.id}`);
  }

  onClickAdd(event: MouseEvent) {
    this.dialogService
      .open(CreateOrEditRecurringTransactionComponent)
      .onClose.subscribe((data: { success: boolean; recurringTransaction: RecurringTransaction }) => {
        if (data.success) {
          this.recurringTransactions.push(data.recurringTransaction);
          this.setTransactionList();

          this.toasterService.success("", "Added transaction");
        }
      });
  }

  async loadData() {
    this.recurringTransactions = await this.recurringTransactionService.getRecurringTransactionsByFilter(
      Maybe.none(),
      Maybe.none(),
      Maybe.none(),
      this.loadFinished
    );
    this.setTransactionList();
  }

  private setTransactionList() {
    this.table.setData(this.recurringTransactions);
  }

  private getTableSettings(): Settings {
    return {
      columns: {
        accountId: {
          title: "Account",
          type: IColumnType.Custom,
          renderComponent: TableNameCellComponent,
          isSortable: false,
          onComponentInitFunction: (instance: TableNameCellComponent<RecurringTransaction>) => {
            instance.nameFunction = () => instance.typedData.account.description;
            instance.iconFunction = () => instance.typedData.account.icon;

            instance.showDefaultIcon = false;
            instance.iconSize = "small";
          },
        },
        categoryId: {
          title: "Category",
          type: IColumnType.Custom,
          renderComponent: TableNameCellComponent,
          isSortable: false,
          onComponentInitFunction: (instance: TableNameCellComponent<RecurringTransaction>) => {
            instance.nameFunction = () => instance.typedData.category.map(c => c.getCompleteName()).valueOrElse("-");
            instance.iconFunction = () => instance.typedData.category.map(c => c.icon).valueOrElse(undefined);

            instance.showDefaultIcon = false;
            instance.iconSize = "small";
          },
        },
        receivingAccountId: {
          title: "Receiver",
          type: IColumnType.Custom,
          renderComponent: TableNameCellComponent,
          isSortable: false,
          onComponentInitFunction: (instance: TableNameCellComponent<RecurringTransaction>) => {
            instance.nameFunction = () => instance.typedData.receivingAccount.map(a => a.description).valueOrElse("-");
            instance.iconFunction = () => instance.typedData.receivingAccount.map(a => a.icon).valueOrElse(undefined);

            instance.showDefaultIcon = false;
            instance.iconSize = "small";
          },
        },
        description: {
          title: "Description",
          type: IColumnType.Text,
        },
        startDate: {
          title: "Start Date",
          type: IColumnType.Custom,
          renderComponent: TableDateCellComponent,
          isSortable: false,
          onComponentInitFunction: (instance: TableDateCellComponent) => {
            instance.showFutureIcon = false;
          },
        },
        endDate: {
          title: "End Date",
          type: IColumnType.Custom,
          renderComponent: TableMaybeDateCellComponent,
          isSortable: false,
        },
        amount: {
          title: "Amount",
          type: IColumnType.Custom,
          renderComponent: TableTransactionAmountCellComponent,
          isSortable: false,
        },
        type: {
          title: "Type",
          type: IColumnType.Custom,
          renderComponent: TableTransactionTypeIconCellComponent,
          isSortable: false,
        },
      },
      hideSubHeader: true,
      rowClassFunction: (row: RecurringTransaction) => {
        let classes: string[] = [];

        if (row.finished) classes.push("obsolete");

        return classes;
      },
    };
  }
}
