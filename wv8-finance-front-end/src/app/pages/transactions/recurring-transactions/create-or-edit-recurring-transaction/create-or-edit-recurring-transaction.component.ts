import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import {
  NbStepperComponent,
  NbRangepickerComponent,
  NbDialogRef,
  NbToastrService,
  NbDateService,
  NbCalendarRange,
  NbDatepicker,
  NbTabComponent,
  NbTabsetComponent,
} from "@nebular/theme";
import { RecurringTransaction } from "../../../../@core/models/recurring-transaction.model";
import { RecurringTransactionData } from "../../../../@core/data/recurring-transaction";
import { TransactionType } from "../../../../@core/enums/transaction-type.enum";
import { Category } from "../../../../@core/models/category.model";
import { Maybe } from "@wv8/typescript.core";
import { InputRecurringTransaction } from "../../../../@core/datatransfer/input-recurring-transaction";
import { CreateOrEditRecurringExpenseComponent } from "./create-or-edit-recurring-expense/create-or-edit-recurring-expense.component";

@Component({
  selector: "create-or-edit-recurring-transaction",
  templateUrl: "./create-or-edit-recurring-transaction.component.html",
  styleUrls: ["./create-or-edit-recurring-transaction.component.scss"],
})
export class CreateOrEditRecurringTransactionComponent implements OnInit {
  @ViewChild("expenseTab", { static: true })
  expenseTab: NbTabComponent;
  @ViewChild("incomeTab", { static: true })
  incomeTab: NbTabComponent;
  @ViewChild("transferTab", { static: true })
  transferTab: NbTabComponent;

  @ViewChild("expenseTabComponent", { static: true })
  expenseTabComponent: CreateOrEditRecurringExpenseComponent;

  @Input()
  recurringTransaction: RecurringTransaction;

  editing = false;
  header: string = "Creating recurring transaction";

  updateInstances: boolean = true;

  transactionTypes = TransactionType;
  categories: Category[];

  constructor(
    protected dialogRef: NbDialogRef<CreateOrEditRecurringTransactionComponent>,
    private recurringTransactionService: RecurringTransactionData,
    private toasterService: NbToastrService,
    private dateService: NbDateService<Date>
  ) { }

  ngOnInit() {
    if (this.recurringTransaction) {
      this.editing = true;
      this.header = `Editing recurring transaction`;

      switch (this.recurringTransaction.type) {
        case TransactionType.Expense:
          this.expenseTab.active = true;
          break;
        case TransactionType.Income:
          this.incomeTab.active = true;
          break;
        case TransactionType.Transfer:
          this.transferTab.active = true;
          break;
      }
    } else {
      this.recurringTransaction = new RecurringTransaction();
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      this.recurringTransaction.startDate = today;
      this.recurringTransaction.endDate = Maybe.some(
        this.dateService.addMonth(today, 1)
      );
      this.recurringTransaction.categoryId = Maybe.none();
      this.recurringTransaction.receivingAccountId = Maybe.none();
      this.recurringTransaction.needsConfirmation = false;
    }
  }

  onTypeChange(selectedTab: NbTabComponent) {
    if (this.editing) return;

    this.recurringTransaction.type = this.transactionTypes[
      selectedTab.tabTitle
    ];

    switch (this.recurringTransaction.type) {
      case TransactionType.Expense:
      case TransactionType.Income:
        this.recurringTransaction.category = Maybe.none();
        this.recurringTransaction.categoryId = Maybe.none();
        break;
      case TransactionType.Transfer:
        this.recurringTransaction.receivingAccount = Maybe.none();
        this.recurringTransaction.receivingAccountId = Maybe.none();
        break;
    }
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }

  async submit() {
    let errors = this.validate().reverse();
    if (errors.length > 0) {
      errors.map((e) => this.toasterService.warning(e, "Incorrect data"));
      return;
    }

    var amount =
      this.recurringTransaction.type == TransactionType.Expense
        ? -this.recurringTransaction.amount
        : this.recurringTransaction.amount;

    var splitDetails =
      this.recurringTransaction.type == TransactionType.Expense &&
        this.expenseTabComponent.hasSplits
        ? this.expenseTabComponent.splits
          .filter((s) => s.user.isSome && s.amount > 0)
          .map((s) => s.asInput())
        : [];

    let input = new InputRecurringTransaction(
      this.recurringTransaction.accountId,
      this.recurringTransaction.description,
      this.recurringTransaction.startDate,
      this.recurringTransaction.endDate,
      amount,
      this.recurringTransaction.categoryId,
      this.recurringTransaction.receivingAccountId,
      this.recurringTransaction.needsConfirmation,
      this.recurringTransaction.interval,
      this.recurringTransaction.intervalUnit,
      [],
      splitDetails
    );

    if (this.editing) {
      this.recurringTransaction = await this.recurringTransactionService.updateRecurringTransaction(
        this.recurringTransaction.id,
        input,
        this.updateInstances
      );
      this.dialogRef.close({
        success: true,
        recurringTransaction: this.recurringTransaction,
      });
    } else {
      this.recurringTransaction = await this.recurringTransactionService.createRecurringTransaction(
        input
      );
      this.dialogRef.close({
        success: true,
        recurringTransaction: this.recurringTransaction,
      });
    }
  }

  private validate() {
    let messages: string[] = [];

    if (this.recurringTransaction.type === TransactionType.Expense)
      messages = messages.concat(this.expenseTabComponent.validate());

    if (!this.recurringTransaction.accountId)
      messages.push("Select an account.");
    if (
      !this.recurringTransaction.startDate ||
      !this.recurringTransaction.endDate
    )
      messages.push("Select a period.");
    if (
      !this.recurringTransaction.description ||
      this.recurringTransaction.description.trim().length < 3
    )
      messages.push("Enter a description.");
    if (
      !this.recurringTransaction.amount ||
      this.recurringTransaction.amount <= 0
    )
      messages.push("Enter a positive amount.");

    switch (this.recurringTransaction.type) {
      case TransactionType.Expense:
      case TransactionType.Income:
        if (this.recurringTransaction.categoryId.isNone)
          messages.push("No category selected.");
        break;
      case TransactionType.Transfer:
        if (this.recurringTransaction.receivingAccountId.isNone)
          messages.push("No receiver selected.");
        break;
    }

    return messages;
  }
}
