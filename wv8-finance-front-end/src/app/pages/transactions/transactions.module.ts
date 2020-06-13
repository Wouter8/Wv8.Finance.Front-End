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
  NbSelectModule,
  NbFormFieldModule
} from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule } from "@angular/forms";
import { TransactionsOverviewComponent } from "./transactions-overview/transactions-overview.component";
import { TransactionComponent } from "./transaction/transaction.component";
import { CreateOrEditTransactionComponent } from "./create-or-edit-transaction/create-or-edit-transaction.component";
import { TransactionsRoutingModule } from "./transactions-routing.module";
import { TransactionsComponent } from "./transactions.component";
import { CreateOrEditNonTransferComponent } from "./create-or-edit-transaction/create-or-edit-income/create-or-edit-non-transfer.component";
import { CreateOrEditTransferComponent } from "./create-or-edit-transaction/create-or-edit-transfer/create-or-edit-transfer.component";
import { RecurringTransactionsOverviewComponent } from "./recurring-transactions/recurring-transactions-overview/recurring-transactions-overview.component";
import { CreateOrEditRecurringTransactionComponent } from "./recurring-transactions/create-or-edit-recurring-transaction/create-or-edit-recurring-transaction.component";
import { CreateOrEditRecurringNonTransferComponent } from "./recurring-transactions/create-or-edit-recurring-transaction/create-or-edit-recurring-income/create-or-edit-recurring-non-transfer.component";
import { CreateOrEditRecurringTransferComponent } from "./recurring-transactions/create-or-edit-recurring-transaction/create-or-edit-recurring-transfer/create-or-edit-recurring-transfer.component";
import { RecurringTransactionComponent } from "./recurring-transactions/recurring-transaction/recurring-transaction.component";
import { DeleteRecurringTransactionComponent } from "./recurring-transactions/delete-recurring-transaction/delete-recurring-transaction.component";
import { ConfirmTransactionComponent } from "./confirm-transaction/confirm-transaction.component";
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
    NbSelectModule,
    NbFormFieldModule
  ],
  declarations: [
    TransactionsComponent,
    TransactionsOverviewComponent,
    TransactionComponent,
    CreateOrEditTransactionComponent,
    CreateOrEditNonTransferComponent,
    CreateOrEditTransferComponent,
    RecurringTransactionsOverviewComponent,
    RecurringTransactionComponent,
    CreateOrEditRecurringTransactionComponent,
    CreateOrEditRecurringNonTransferComponent,
    CreateOrEditRecurringTransferComponent,
    DeleteRecurringTransactionComponent,
    ConfirmTransactionComponent
  ],
  entryComponents: [
    CreateOrEditTransactionComponent,
    CreateOrEditRecurringTransactionComponent,
    DeleteRecurringTransactionComponent,
    ConfirmTransactionComponent
  ]
})
export class TransactionsModule {}
