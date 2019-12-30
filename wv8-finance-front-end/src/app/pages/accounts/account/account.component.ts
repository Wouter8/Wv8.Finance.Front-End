import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IAccount, AccountData } from "../../../@core/data/account";
import { Maybe } from "wv8.typescript.core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { CreateOrEditAccountComponent } from "../create-or-edit-account/create-or-edit-account.component";
import { Account } from "../../../@core/models/account.model";
import { ConfirmDialogComponent } from "../../../@theme/components/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit {
  account: Account;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountData,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = new Maybe<number>(params.id);
      if (id.isSome) {
        try {
        this.accountService
          .getAccount(id.value)
          .subscribe(account => (this.account = account));
        } catch {
          this.toasterService.danger('', 'Account not found');
          this.router.navigateByUrl('/accounts');
        }
      }
    });
  }

  onObsoleteClick() {
    if (this.account.obsolete) {
      this.accountService
        .setAccountObsolete(this.account.id, false)
        .subscribe(() => {
          this.account.obsolete = false;

          this.toasterService.success('', 'Recovered account');
        });
    } else {
      this.dialogService
        .open(ConfirmDialogComponent, {
          context: { body: `Mark ${this.account.name} obsolete?` }
        })
        .onClose.subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.accountService.setAccountObsolete(this.account.id, true).subscribe(() => {
              this.account.obsolete = true;
              this.account.default = false;

              this.toasterService.success('', 'Marked account obsolete');
            });
          }
        });
    }
  }

  onEditClick() {
    this.dialogService
      .open(CreateOrEditAccountComponent, {
        context: { account: Account.fromDto(this.account) }
      })
      .onClose.subscribe((data: { success: boolean; account: Account }) => {
        if (data && data.success) {
          this.accountService.updateAccount(data.account).subscribe(updated => this.account = updated);

          this.toasterService.success('', 'Updated account');
        }
      });
  }
}
