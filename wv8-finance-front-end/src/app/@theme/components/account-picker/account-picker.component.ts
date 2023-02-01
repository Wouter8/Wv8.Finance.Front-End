import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
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

  @Input() selectDefault: boolean = true;
  @Input() placeholderText: string = "Select account";
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() includeObsolete: boolean = false;
  @Input() filterAccounts: number[] = [];
  @Input() showResetOption: boolean = false;
  @Input() accountId: number = undefined;
  @Input() onlyNormalAccounts: boolean = false;
  @Output() accountIdChange = new EventEmitter<number>();

  selectedAccount: Account = undefined;

  initialAccountSelected: boolean = false;

  constructor(private accountService: AccountData) {}

  async ngOnChanges() {
    await this.loadAccounts(this.accountId);

    if (this.accountId) {
      this.selectAccount(this.accountId);
    } else if (!this.initialAccountSelected && this.selectDefault) {
      let defaultAccounts = this.accounts.filter(a => a.isDefault);
      if (defaultAccounts.length > 0) this.selectAccount(defaultAccounts[0].id);
    }
  }

  async ngOnInit() {}

  private async loadAccounts(id: number) {
    if (this.accounts) return;
    this.accounts =
      id && this.disabled
        ? [await this.accountService.getAccount(id)]
        : (
            await this.accountService.getAccounts(
              this.includeObsolete,
              this.onlyNormalAccounts ? Maybe.some(AccountType.Normal) : Maybe.none()
            )
          ).filter(c => this.filterAccounts.indexOf(c.id) < 0);
  }

  private selectAccount(id: number) {
    this.initialAccountSelected = true;

    // Set after loading everything so options get properly selected.
    setTimeout(() => {
      this.accountId = id;
      this.accountSelected();
    });
  }

  accountSelected() {
    if (!this.accountId) {
      return this.accountIdChange.emit(undefined);
    }

    if (this.accountId) {
      this.selectedAccount = this.accounts.filter(c => c.id == this.accountId)[0];
    }

    this.accountIdChange.emit(this.selectedAccount.id);
  }
}
