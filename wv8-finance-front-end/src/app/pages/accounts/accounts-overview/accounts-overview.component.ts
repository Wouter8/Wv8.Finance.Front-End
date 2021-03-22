import { Component, OnInit, ViewChild } from "@angular/core";
import { TableComponent } from "../../../@theme/components/table/table.component";
import { CustomTableSettings } from "../../../@theme/components/table/table-settings.model";
import { TableDefaultAndObsoleteCellComponent } from "../../../@theme/components/table/table-default-and-obsolete-cell/table-default-and-obsolete-cell.component";
import { TableEuroCellComponent } from "../../../@theme/components/table/table-euro-cell/table-euro-cell.component";
import { AccountData } from "../../../@core/data/account";
import { IAccount } from "../../../@core/data/account";
import { Router, ActivatedRoute } from "@angular/router";
import { NbDialogService, NbToast, NbToastrService } from "@nebular/theme";
import { CreateOrEditAccountComponent } from "../create-or-edit-account/create-or-edit-account.component";
import { Account } from "../../../@core/models/account.model";
import { TableIconCellComponent } from "../../../@theme/components/table/table-icon-cell/table-icon-cell.component";
import { TableNameCellComponent } from "../../../@theme/components/table/table-name-cell/table-name-cell.component";
import { AccountType } from "../../../@core/enums/account-type.enum";
import { Maybe } from "@wv8/typescript.core";

@Component({
  selector: "accounts-overview",
  templateUrl: "./accounts-overview.component.html",
  styleUrls: ["./accounts-overview.component.scss"],
})
export class AccountsOverviewComponent implements OnInit {
  @ViewChild("table", { static: true })
  table: TableComponent<IAccount>;
  accounts: IAccount[] = [];

  showObsolete: boolean = false;

  constructor(
    private accountService: AccountData,
    private router: Router,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService
  ) {}

  ngOnInit() {
    this.table.setSettings(this.getTableSettings());
    this.loadData();
  }

  onShowObsoleteChange(event: boolean) {
    this.showObsolete = event;
    this.setAccountList(event);
  }

  onSelect(event: IAccount) {
    this.router.navigateByUrl(`accounts/${event.id}`);
  }

  async onClickAdd(event: MouseEvent) {
    this.dialogService
      .open(CreateOrEditAccountComponent)
      .onClose.subscribe(
        async (data: { success: boolean; account: Account }) => {
          if (data.success) {
            this.accounts.push(data.account);
            this.loadData();

            this.toasterService.success("", "Added account");
          }
        }
      );
  }

  private async loadData() {
    this.accounts = await this.accountService.getAccounts(true, Maybe.none());
    this.setAccountList(this.showObsolete);
  }

  private setAccountList(showObsolete: boolean) {
    if (showObsolete) {
      this.table.setData(this.accounts);
    } else {
      this.table.setData(this.accounts.filter((a) => !a.isObsolete));
    }
  }

  private getTableSettings(): CustomTableSettings<IAccount> {
    return {
      columns: {
        description: {
          title: "Description",
          type: "custom",
          renderComponent: TableNameCellComponent,
          sort: false,
        },
        currentBalance: {
          title: "Current Balance",
          type: "custom",
          renderComponent: TableEuroCellComponent,
          sort: false,
        },
      },
      hideFilter: true,
      clickable: true,
      rowClassFunction: (row: IAccount) => {
        let classes: string[] = [];
        if (row.isObsolete) {
          classes.push("obsolete");
        }
        return classes;
      },
    };
  }
}
