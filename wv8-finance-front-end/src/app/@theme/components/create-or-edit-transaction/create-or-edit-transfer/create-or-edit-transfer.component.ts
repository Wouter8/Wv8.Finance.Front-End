import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from "@angular/core";
import { NbDatepicker, NbDateService } from "@nebular/theme";
import { Transaction } from "../../../../@core/models/transaction.model";
import { Maybe } from "@wv8/typescript.core";
import { AccountType } from "../../../../@core/enums/account-type.enum";
import { Account } from "../../../../@core/models/account.model";

@Component({
  selector: "create-or-edit-transfer",
  templateUrl: "./create-or-edit-transfer.component.html",
  styleUrls: ["./create-or-edit-transfer.component.scss"],
})
export class CreateOrEditTransferComponent implements OnInit {
  @Input() transaction: Transaction;
  @Input() editing: boolean;
  @Input() accounts: Account[];

  warningMessage: Maybe<string> = Maybe.none();
  editableReceiver: boolean = true;

  accountTypes = AccountType;

  constructor() {}

  ngOnInit() {
    if (!this.transaction.fullyEditable) {
      // If the sender is Splitwise, then the receiver is editable.
      // Otherwise the receiver is Splitwise and the sender is editable.
      this.editableReceiver =
        this.transaction.account.type == AccountType.Splitwise && this.transaction.receivingAccount.value.type == AccountType.Normal;
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

  setAccount(account: Account[]) {
    this.transaction.account = account[0];
    this.transaction.accountId = account[0].id;
  }

  setReceiver(account: Account[]) {
    this.transaction.receivingAccount = new Maybe(account[0]);
    this.transaction.receivingAccountId = new Maybe(account[0].id);
  }

  public accountId = (a: Account) => a.id;
  public accountTitle = (a: Account) => a.description;
  public accountIcon = Maybe.some((a: Account) => a.icon);
}
