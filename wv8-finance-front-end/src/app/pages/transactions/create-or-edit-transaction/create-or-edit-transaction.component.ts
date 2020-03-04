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
  NbTabsetComponent
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
import { CategoryType } from "../../../@core/enums/category-type";

@Component({
  selector: "create-or-edit-transaction",
  templateUrl: "./create-or-edit-transaction.component.html",
  styleUrls: ["./create-or-edit-transaction.component.scss"]
})
export class CreateOrEditTransactionComponent implements OnInit {
  @ViewChild("expenseTab", { static: true })
  expenseTab: NbTabComponent;
  @ViewChild("incomeTab", { static: true })
  incomeTab: NbTabComponent;
  @ViewChild("transferTab", { static: true })
  transferTab: NbTabComponent;

  @Input()
  transaction: Transaction;

  editing = false;
  header: string = "Creating transaction";

  transactionTypes = TransactionType;
  categoryTypes = CategoryType;
  categories: Category[];

  constructor(
    protected dialogRef: NbDialogRef<CreateOrEditTransactionComponent>,
    private transactionService: TransactionData,
    private toasterService: NbToastrService,
    private dateService: NbDateService<Date>
  ) {}

  ngOnInit() {
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
  }

  onTypeChange(selectedTab: NbTabComponent) {
    if (this.editing) return;

    this.transaction.type = this.transactionTypes[selectedTab.tabTitle];

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
    let errors = this.validate().reverse();
    if (errors.length > 0) {
      errors.map(e => this.toasterService.warning(e, "Incorrect data"));
      return;
    }

    let amount =
      this.transaction.type == TransactionType.Expense
        ? -this.transaction.amount
        : this.transaction.amount;

    if (this.editing) {
      this.transaction = await this.transactionService.updateTransaction(
        this.transaction.id,
        this.transaction.accountId,
        this.transaction.description,
        this.transaction.date,
        amount,
        this.transaction.categoryId,
        this.transaction.receivingAccountId
      );
      this.dialogRef.close({ success: true, transaction: this.transaction });
    } else {
      this.transaction = await this.transactionService.createTransaction(
        this.transaction.accountId,
        this.transaction.type,
        this.transaction.description,
        this.transaction.date,
        amount,
        this.transaction.categoryId,
        this.transaction.receivingAccountId
      );
      this.dialogRef.close({ success: true, transaction: this.transaction });
    }
  }

  setReceivingAccountId(id: number) {
    this.transaction.receivingAccountId = new Maybe(id);
  }

  private validate() {
    let messages: string[] = [];

    if (!this.transaction.accountId) messages.push("Select an account.");
    if (!this.transaction.date) messages.push("Select a date.");
    if (
      !this.transaction.description ||
      this.transaction.description.trim().length < 3
    )
      messages.push("Enter a description.");
    if (!this.transaction.amount || this.transaction.amount <= 0)
      messages.push("Amount must be greater than 0.");

    switch (this.transaction.type) {
      case TransactionType.Expense:
      case TransactionType.Income:
        if (this.transaction.categoryId.isNone)
          messages.push("No category selected.");
        break;
      case TransactionType.Transfer:
        if (this.transaction.receivingAccountId.isNone)
          messages.push("No receiver selected.");
        break;
    }

    return messages;
  }
}
