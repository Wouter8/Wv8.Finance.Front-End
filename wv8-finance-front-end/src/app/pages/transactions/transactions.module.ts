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
  NbFormFieldModule,
} from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule } from "@angular/forms";
import { TransactionsOverviewComponent } from "./transactions-overview/transactions-overview.component";
import { TransactionComponent } from "./transaction/transaction.component";
import { TransactionsRoutingModule } from "./transactions-routing.module";
import { TransactionsComponent } from "./transactions.component";
import { RecurringTransactionsOverviewComponent } from "./recurring-transactions/recurring-transactions-overview/recurring-transactions-overview.component";
import { CreateOrEditRecurringTransactionComponent } from "./recurring-transactions/create-or-edit-recurring-transaction/create-or-edit-recurring-transaction.component";
import { RecurringTransactionComponent } from "./recurring-transactions/recurring-transaction/recurring-transaction.component";
import { DeleteRecurringTransactionComponent } from "./recurring-transactions/delete-recurring-transaction/delete-recurring-transaction.component";
import { ConfirmTransactionComponent } from "./confirm-transaction/confirm-transaction.component";
import { CreateOrEditRecurringExternalComponent } from "./recurring-transactions/create-or-edit-recurring-transaction/create-or-edit-recurring-external/create-or-edit-recurring-external.component";
import { CreateOrEditRecurringInternalComponent } from "./recurring-transactions/create-or-edit-recurring-transaction/create-or-edit-recurring-internal/create-or-edit-recurring-internal.component";
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
    NbFormFieldModule,
  ],
  declarations: [
    TransactionsComponent,
    TransactionsOverviewComponent,
    TransactionComponent,
    RecurringTransactionsOverviewComponent,
    RecurringTransactionComponent,
    CreateOrEditRecurringTransactionComponent,
    CreateOrEditRecurringExternalComponent,
    CreateOrEditRecurringInternalComponent,
    DeleteRecurringTransactionComponent,
    ConfirmTransactionComponent,
  ],
  entryComponents: [
    CreateOrEditRecurringTransactionComponent,
    DeleteRecurringTransactionComponent,
    ConfirmTransactionComponent,
  ],
})
export class TransactionsModule {}
