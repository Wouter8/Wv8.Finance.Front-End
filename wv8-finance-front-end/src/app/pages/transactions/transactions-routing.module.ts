import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { TransactionsComponent } from "./transactions.component";
import { TransactionsOverviewComponent } from "./transactions-overview/transactions-overview.component";
import { TransactionComponent } from "./transaction/transaction.component";
import { RecurringTransactionsOverviewComponent } from "./recurring-transactions/recurring-transactions-overview/recurring-transactions-overview.component";
import { RecurringTransactionComponent } from "./recurring-transactions/recurring-transaction/recurring-transaction.component";
import { ImportTransactionsComponent } from "./import-transactions/import-transactions.component";

const routes: Routes = [
  {
    path: "",
    component: TransactionsComponent,
    children: [
      {
        path: "",
        component: TransactionsOverviewComponent,
      },
      {
        path: "recurring",
        component: RecurringTransactionsOverviewComponent,
      },
      {
        path: "recurring/:id",
        component: RecurringTransactionComponent,
      },
      {
        path: "import",
        component: ImportTransactionsComponent,
      },
      {
        path: ":id",
        component: TransactionComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
