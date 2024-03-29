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
import { Transaction } from "../../../@core/models/transaction.model";
import { OverlappingType } from "../../../@core/enums/overlapping-type";
import { TransactionData } from "../../../@core/data/transaction";
import { TransactionType } from "../../../@core/enums/transaction-type.enum";
import { FontAwesomeIcon } from "../../../@theme/components/font-awesome-icon-picker/font-awesome-icon";
import { IIcon } from "../../../@core/data/icon";
import { Category } from "../../../@core/models/category.model";
import { CategoryData } from "../../../@core/data/category";
import { Maybe } from "@wv8/typescript.core";
import { InputTransaction } from "../../../@core/datatransfer/input-transaction";
import { CreateOrEditExpenseComponent } from "./create-or-edit-expense/create-or-edit-expense.component";
import { AccountType } from "../../../@core/enums/account-type.enum";
import { Account } from "../../../@core/models/account.model";
import { AccountData } from "../../../@core/data/account";

@Component({
  selector: "create-or-edit-transaction",
  templateUrl: "./create-or-edit-transaction.component.html",
  styleUrls: ["./create-or-edit-transaction.component.scss"],
})
export class CreateOrEditTransactionComponent implements OnInit {
  @ViewChild("expenseTab", { static: true })
  expenseTab: NbTabComponent;
  @ViewChild("incomeTab", { static: true })
  incomeTab: NbTabComponent;
  @ViewChild("transferTab", { static: true })
  transferTab: NbTabComponent;

  @ViewChild("expenseTabComponent", { static: false })
  expenseTabComponent: CreateOrEditExpenseComponent;

  @Input()
  transaction: Transaction;

  initialized = false;

  editing = false;
  header: string = "Creating transaction";

  transactionTypes = TransactionType;
  categories: Category[] = [];
  accounts: Account[] = [];

  constructor(
    protected dialogRef: NbDialogRef<CreateOrEditTransactionComponent>,
    private transactionService: TransactionData,
    private toasterService: NbToastrService,
    private accountService: AccountData,
    private categoryService: CategoryData,
    private dateService: NbDateService<Date>
  ) {}

  async ngOnInit() {
    if (this.transaction) {
      this.editing = true;
      this.header = `Editing transaction`;

      switch (this.transaction.type) {
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
      this.transaction = new Transaction();
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      this.transaction.date = today;
      this.transaction.categoryId = Maybe.none();
      this.transaction.receivingAccountId = Maybe.none();
    }
    this.accounts = await this.accountService.getAccounts(false, Maybe.none());
    this.categories = await this.categoryService.getCategories(false, true);

    this.initialized = true;
  }

  onTypeChange(selectedTab: NbTabComponent) {
    if (this.editing) return;

    const oldType = this.transaction.type;
    this.transaction.type = this.transactionTypes[selectedTab.tabTitle];

    const shouldClear = !(
      (this.transaction.type === TransactionType.Expense && oldType === TransactionType.Income) ||
      (this.transaction.type === TransactionType.Income && oldType === TransactionType.Expense)
    );
    if (!shouldClear) return;

    switch (this.transaction.type) {
      case TransactionType.Expense:
      case TransactionType.Income:
        this.transaction.category = Maybe.none();
        this.transaction.categoryId = Maybe.none();
        break;
      case TransactionType.Transfer:
        this.transaction.receivingAccount = Maybe.none();
        this.transaction.receivingAccountId = Maybe.none();
        break;
    }
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }

  async submit() {
    // If the transaction is not fully editable, this means that only the category is editable.
    if (!this.transaction.fullyEditable) {
      if (this.transaction.type == TransactionType.Transfer) {
        if (this.transaction.account.type == AccountType.Splitwise) {
          await this.transactionService.updateTransactionReceiver(this.transaction.id, this.transaction.receivingAccountId.value);
        } else {
          await this.transactionService.updateTransactionSender(this.transaction.id, this.transaction.accountId);
        }
      } else {
        await this.transactionService.updateTransactionCategory(this.transaction.id, this.transaction.categoryId.value);
      }
      this.dialogRef.close({ success: true, transaction: this.transaction });
      return;
    }

    let errors = this.validate().reverse();
    if (errors.length > 0) {
      errors.map(e => this.toasterService.warning(e, "Incorrect data"));
      return;
    }

    var amount = this.transaction.type == TransactionType.Expense ? -this.transaction.amount : this.transaction.amount;

    var splitDetails =
      this.transaction.type == TransactionType.Expense && this.expenseTabComponent.hasSplits
        ? this.expenseTabComponent.splits.filter(s => s.userId !== -1 && s.amount > 0).map(s => s.asInput())
        : [];

    let input = new InputTransaction(
      this.transaction.accountId,
      this.transaction.description,
      this.transaction.date,
      amount,
      this.transaction.categoryId,
      this.transaction.receivingAccountId,
      this.transaction.needsConfirmation,
      [],
      splitDetails
    );

    if (this.editing) {
      this.transaction = await this.transactionService.updateTransaction(this.transaction.id, input);
      this.dialogRef.close({ success: true, transaction: this.transaction });
    } else {
      this.transaction = await this.transactionService.createTransaction(input);
      this.dialogRef.close({ success: true, transaction: this.transaction });
    }
  }

  private validate() {
    let messages: string[] = [];

    if (this.transaction.type === TransactionType.Expense) messages = messages.concat(this.expenseTabComponent.validate());

    if (!this.transaction.accountId) messages.push("Select an account.");
    if (!this.transaction.date) messages.push("Select a date.");
    if (!this.transaction.description || this.transaction.description.trim().length < 3) messages.push("Enter a description.");

    if (!this.transaction.amount || this.transaction.amount <= 0) messages.push("Enter a positive amount.");

    switch (this.transaction.type) {
      case TransactionType.Expense:
      case TransactionType.Income:
        if (this.transaction.categoryId.isNone) messages.push("No category selected.");
        break;
      case TransactionType.Transfer:
        if (this.transaction.receivingAccountId.isNone) messages.push("No receiver selected.");
        break;
    }

    return messages;
  }
}
