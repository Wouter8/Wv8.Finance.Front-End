import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { AccountData } from "../../../@core/data/account";
import { Account } from "../../../@core/models/account.model";
import { Maybe } from "wv8.typescript.core";

@Component({
  selector: "account-picker",
  templateUrl: "./account-picker.component.html",
  styleUrls: ["./account-picker.component.scss"]
})
export class AccountPickerComponent implements OnInit, OnChanges {
  accounts: Account[];

  inputIsObject = false;

  @Input() selectDefault: boolean = true;
  @Input() placeholderText: string = "Select account";
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() includeObsolete: boolean = false;
  @Input() filterAccounts: number[] = [];
  @Input() showResetOption: boolean = false;
  @Input() account: number | Account;
  @Output() accountChange = new EventEmitter<number | Account>();

  selectedAccount: Account = undefined;
  accountId: number = undefined;

  constructor(private accountService: AccountData) {}

  async ngOnInit() {}

  async ngOnChanges() {
    if (this.account instanceof Account) {
      this.inputIsObject = true;
      this.accountId = this.account.id;
    } else {
      this.accountId = this.account;
    }

    this.accounts =
      this.accountId && this.disabled
        ? [await this.accountService.getAccount(this.accountId)]
        : (await this.accountService.getAccounts(this.includeObsolete)).filter(
            c => this.filterAccounts.indexOf(c.id) < 0
          );

    if (this.accountId) {
      this.selectedAccount = this.accounts.filter(
        c => c.id == this.accountId
      )[0];
    } else if (this.selectDefault) {
      let defaultAccounts = this.accounts.filter(a => a.isDefault);
      if (defaultAccounts.length > 0) this.accountId = defaultAccounts[0].id;
      this.accountSelected();
    }
  }

  accountSelected() {
    if (!this.accountId) {
      return this.accountChange.emit(undefined);
    }

    this.selectedAccount = this.accounts.filter(c => c.id == this.accountId)[0];

    this.accountChange.emit(
      this.inputIsObject ? this.selectedAccount : this.selectedAccount.id
    );
  }
}