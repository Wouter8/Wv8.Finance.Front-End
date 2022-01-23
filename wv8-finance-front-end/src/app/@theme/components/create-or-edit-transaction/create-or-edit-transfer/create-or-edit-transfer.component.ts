import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from "@angular/core";
import { NbDatepicker, NbDateService } from "@nebular/theme";
import { Transaction } from "../../../../@core/models/transaction.model";
import { Maybe } from "@wv8/typescript.core";
import { AccountType } from "../../../../@core/enums/account-type.enum";

@Component({
  selector: "create-or-edit-transfer",
  templateUrl: "./create-or-edit-transfer.component.html",
  styleUrls: ["./create-or-edit-transfer.component.scss"],
})
export class CreateOrEditTransferComponent implements OnInit {
  @Input() transaction: Transaction;
  @Input() editing: boolean;

  warningMessage: Maybe<string> = Maybe.none();
  editableReceiver: boolean = true;

  accountTypes = AccountType;

  constructor() {}

  ngOnInit() {
    if (!this.transaction.fullyEditable) {
      // If the sender is Splitwise, then the receiver is editable.
      // Otherwise the receiver is Splitwise and the sender is editable.
      this.editableReceiver =
        this.transaction.account.type == AccountType.Splitwise &&
        this.transaction.receivingAccount.value.type == AccountType.Normal;
      this.warningMessage = Maybe.some(
        `Only the ${
          this.editableReceiver ? "receiver" : "sender"
        } of this transaction is editable.\nUpdate the other properties in Splitwise.`
      );
    }
  }

  dateChanged(date: Date) {
    this.transaction.date = new Date(date);
  }

  setReceivingAccountId(id: number) {
    this.transaction.receivingAccountId = new Maybe(id);
  }
}
