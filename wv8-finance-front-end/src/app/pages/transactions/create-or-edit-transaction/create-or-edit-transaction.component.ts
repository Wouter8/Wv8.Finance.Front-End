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

@Component({
  selector: "create-or-edit-transaction",
  templateUrl: "./create-or-edit-transaction.component.html",
  styleUrls: ["./create-or-edit-transaction.component.scss"],
})
export class CreateOrEditTransactionComponent implements OnInit {
  @ViewChild("externalTab", { static: true })
  externalTab: NbTabComponent;
  @ViewChild("internalTab", { static: true })
  internalTab: NbTabComponent;

  @Input()
  transaction: Transaction;

  editing = false;
  header: string = "Creating transaction";

  transactionTypes = TransactionType;
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
        case TransactionType.External:
          this.externalTab.active = true;
          break;
        case TransactionType.Internal:
          this.internalTab.active = true;
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
      case TransactionType.External:
        this.transaction.category = Maybe.none();
        this.transaction.categoryId = Maybe.none();
        break;
      case TransactionType.Internal:
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
      errors.map((e) => this.toasterService.warning(e, "Incorrect data"));
      return;
    }

    if (this.editing) {
      this.transaction = await this.transactionService.updateTransaction(
        this.transaction.id,
        this.transaction.accountId,
        this.transaction.description,
        this.transaction.date,
        this.transaction.amount,
        this.transaction.categoryId,
        this.transaction.receivingAccountId
      );
      this.dialogRef.close({ success: true, transaction: this.transaction });
    } else {
      this.transaction = await this.transactionService.createTransaction(
        this.transaction.accountId,
        this.transaction.description,
        this.transaction.date,
        this.transaction.amount,
        this.transaction.categoryId,
        this.transaction.receivingAccountId,
        this.transaction.needsConfirmation
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
    if (
      this.transaction.type == TransactionType.Internal &&
      (!this.transaction.amount || this.transaction.amount <= 0)
    )
      messages.push("Amount must be greater than 0 for internal transactions.");

    switch (this.transaction.type) {
      case TransactionType.External:
        if (this.transaction.categoryId.isNone)
          messages.push("No category selected.");
        break;
      case TransactionType.Internal:
        if (this.transaction.receivingAccountId.isNone)
          messages.push("No receiver selected.");
        break;
    }

    return messages;
  }
}
