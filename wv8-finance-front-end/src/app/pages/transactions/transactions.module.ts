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
  NbDatepickerModule,
  NbTabsetModule,
  NbSelectModule
} from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule } from "@angular/forms";
import { TransactionsOverviewComponent } from "./transactions-overview/transactions-overview.component";
import { TransactionComponent } from "./transaction/transaction.component";
import { CreateOrEditTransactionComponent } from "./create-or-edit-transaction/create-or-edit-transaction.component";
import { TransactionsRoutingModule } from "./transactions-routing.module";
import { TransactionsComponent } from "./transactions.component";
import { CreateOrEditExpenseComponent } from './create-or-edit-transaction/create-or-edit-expense/create-or-edit-expense.component';
import { CreateOrEditIncomeComponent } from './create-or-edit-transaction/create-or-edit-income/create-or-edit-income.component';
import { CreateOrEditTransferComponent } from './create-or-edit-transaction/create-or-edit-transfer/create-or-edit-transfer.component';
@NgModule({
  imports: [
    TransactionsRoutingModule,
    NbCardModule,
    ThemeModule,
    NbIconModule,
    NbInputModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
    NbDialogModule.forChild(),
    NbButtonModule,
    FormsModule,
    NbTooltipModule,
    NbDatepickerModule,
    NbTabsetModule,
    NbSelectModule
  ],
  declarations: [
    TransactionsComponent,
    TransactionsOverviewComponent,
    TransactionComponent,
    CreateOrEditTransactionComponent,
    CreateOrEditExpenseComponent,
    CreateOrEditIncomeComponent,
    CreateOrEditTransferComponent
  ],
  entryComponents: [CreateOrEditTransactionComponent]
})
export class TransactionsModule {}
