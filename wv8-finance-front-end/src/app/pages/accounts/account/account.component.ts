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
    private toasterService: NbToastrService
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
          this.toasterService.danger("", "Account not found");
          this.router.navigateByUrl("/accounts");
        }
      } else {
        this.router.navigateByUrl("/accounts");
      }
    });
  }

  onObsoleteClick() {
    if (this.account.isObsolete) {
      this.accountService
        .setAccountObsolete(this.account.id, false)
        .subscribe(() => {
          this.account.isObsolete = false;

          this.toasterService.success("", "Recovered account");
        });
    } else {
      this.dialogService
        .open(ConfirmDialogComponent, {
          context: { body: `Mark ${this.account.description} obsolete?` }
        })
        .onClose.subscribe((confirmed: boolean) => {
          if (confirmed) {
            this.accountService
              .setAccountObsolete(this.account.id, true)
              .subscribe(() => {
                this.account.isObsolete = true;
                this.account.isDefault = false;

                this.toasterService.success("", "Marked account obsolete");
              });
          }
        });
    }
  }

  onEditClick() {
    this.dialogService
      .open(CreateOrEditAccountComponent, {
        context: { account: this.account.copy() }
      })
      .onClose.subscribe((data: { success: boolean; account: Account }) => {
        if (data && data.success) {
          this.accountService
            .updateAccount(
              data.account.id,
              data.account.description,
              data.account.isDefault,
              data.account.icon.pack,
              data.account.icon.name,
              data.account.icon.color
            )
            .subscribe(updated => (this.account = updated));

          this.toasterService.success("", "Updated account");
        }
      });
  }
}
