import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbCardModule,
  NbIconModule,
  NbCheckboxModule,
  NbButtonModule,
  NbDialogModule,
  NbInputModule,
  NbTooltipModule,
  NbPopoverModule,
  NbSelectModule,
} from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { AccountsComponent } from "./accounts.component";
import { Angular2SmartTableModule } from "angular2-smart-table";
import { AccountComponent } from "./account/account.component";
import { AccountsRoutingModule } from "./accounts-routing.module";
import { AccountsOverviewComponent } from "./accounts-overview/accounts-overview.component";
import { CreateOrEditAccountComponent } from "./create-or-edit-account/create-or-edit-account.component";
import { FormsModule } from "@angular/forms";
import { NgxEchartsModule } from "ngx-echarts";
@NgModule({
  imports: [
    AccountsRoutingModule,
    NbCardModule,
    ThemeModule,
    NbIconModule,
    NbInputModule,
    Angular2SmartTableModule,
    NbCheckboxModule,
    NbDialogModule.forChild(),
    NbButtonModule,
    FormsModule,
    NbTooltipModule,
    NbPopoverModule,
    NbSelectModule,
    NgxEchartsModule,
  ],
  declarations: [AccountsComponent, AccountComponent, CreateOrEditAccountComponent, AccountsOverviewComponent],
})
export class AccountsModule {}
