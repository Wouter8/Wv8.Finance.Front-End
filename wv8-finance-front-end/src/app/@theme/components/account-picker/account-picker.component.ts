import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { AccountData } from "../../../@core/data/account";
import { Account } from "../../../@core/models/account.model";
import { Maybe } from "@wv8/typescript.core";
import { AccountType } from "../../../@core/enums/account-type.enum";

@Component({
  selector: "account-picker",
  templateUrl: "./account-picker.component.html",
  styleUrls: ["./account-picker.component.scss"],
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
  @Input() onlyNormalAccounts: boolean = false;
  @Output() accountChange = new EventEmitter<number | Account>();

  selectedAccount: Account = undefined;
  accountId: number = undefined;

  initialAccountSelected: boolean = false;

  constructor(private accountService: AccountData) {}

  async ngOnInit() {}

  async ngOnChanges() {
    let accountId: number;
    if (this.account instanceof Account) {
      this.inputIsObject = true;
      accountId = this.account.id;
    } else {
      accountId = this.account;
    }

    await this.loadAccounts(accountId);

    if (!this.initialAccountSelected) {
      if (accountId) {
        this.selectAccount(accountId);
      } else if (this.selectDefault) {
        let defaultAccounts = this.accounts.filter((a) => a.isDefault);
        if (defaultAccounts.length > 0)
          this.selectAccount(defaultAccounts[0].id);
      }
    }
  }

  private async loadAccounts(id: number) {
    if (this.accounts) return;
    this.accounts =
      id && this.disabled
        ? [await this.accountService.getAccount(id)]
        : (
            await this.accountService.getAccounts(
              this.includeObsolete,
              this.onlyNormalAccounts
                ? Maybe.some(AccountType.Normal)
                : Maybe.none()
            )
          ).filter((c) => this.filterAccounts.indexOf(c.id) < 0);
  }

  private selectAccount(id: number) {
    this.initialAccountSelected = true;

    if (id) {
      this.selectedAccount = this.accounts.filter((c) => c.id == id)[0];
    }

    // Set after loading everything so options get properly selected.
    setTimeout(() => {
      this.accountId = id;
      this.accountSelected();
    });
  }

  accountSelected() {
    if (!this.accountId) {
      return this.accountChange.emit(undefined);
    }

    this.accountChange.emit(
      this.inputIsObject ? this.selectedAccount : this.selectedAccount.id
    );
  }
}
