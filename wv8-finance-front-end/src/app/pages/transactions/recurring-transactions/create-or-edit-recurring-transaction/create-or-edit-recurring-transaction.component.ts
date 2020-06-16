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

@Component({
  selector: "create-or-edit-recurring-transaction",
  templateUrl: "./create-or-edit-recurring-transaction.component.html",
  styleUrls: ["./create-or-edit-recurring-transaction.component.scss"],
})
export class CreateOrEditRecurringTransactionComponent implements OnInit {
  @ViewChild("externalTab", { static: true })
  externalTab: NbTabComponent;
  @ViewChild("internalTab", { static: true })
  internalTab: NbTabComponent;

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
  ) {}

  ngOnInit() {
    if (this.recurringTransaction) {
      this.editing = true;
      this.header = `Editing recurring transaction`;

      switch (this.recurringTransaction.type) {
        case TransactionType.External:
          this.externalTab.active = true;
          break;
        case TransactionType.Internal:
          this.internalTab.active = true;
          break;
      }
    } else {
      this.recurringTransaction = new RecurringTransaction();
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      this.recurringTransaction.startDate = today;
      this.recurringTransaction.endDate = this.dateService.addMonth(today, 1);
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
      case TransactionType.External:
        this.recurringTransaction.category = Maybe.none();
        this.recurringTransaction.categoryId = Maybe.none();
        break;
      case TransactionType.Internal:
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

    if (this.editing) {
      this.recurringTransaction = await this.recurringTransactionService.updateRecurringTransaction(
        this.recurringTransaction.id,
        this.recurringTransaction.accountId,
        this.recurringTransaction.description,
        this.recurringTransaction.startDate,
        this.recurringTransaction.endDate,
        this.recurringTransaction.amount,
        this.recurringTransaction.categoryId,
        this.recurringTransaction.receivingAccountId,
        this.recurringTransaction.interval,
        this.recurringTransaction.intervalUnit,
        this.recurringTransaction.needsConfirmation,
        this.updateInstances
      );
      this.dialogRef.close({
        success: true,
        recurringTransaction: this.recurringTransaction,
      });
    } else {
      this.recurringTransaction = await this.recurringTransactionService.createRecurringTransaction(
        this.recurringTransaction.accountId,
        this.recurringTransaction.description,
        this.recurringTransaction.startDate,
        this.recurringTransaction.endDate,
        this.recurringTransaction.amount,
        this.recurringTransaction.categoryId,
        this.recurringTransaction.receivingAccountId,
        this.recurringTransaction.interval,
        this.recurringTransaction.intervalUnit,
        this.recurringTransaction.needsConfirmation
      );
      this.dialogRef.close({
        success: true,
        recurringTransaction: this.recurringTransaction,
      });
    }
  }

  private validate() {
    let messages: string[] = [];

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
      this.recurringTransaction.type == TransactionType.Internal &&
      (!this.recurringTransaction.amount ||
        this.recurringTransaction.amount <= 0)
    )
      messages.push("Amount must be greater than 0.");

    switch (this.recurringTransaction.type) {
      case TransactionType.External:
        if (this.recurringTransaction.categoryId.isNone)
          messages.push("No category selected.");
        break;
      case TransactionType.Internal:
        if (this.recurringTransaction.receivingAccountId.isNone)
          messages.push("No receiver selected.");
        break;
    }

    return messages;
  }
}
