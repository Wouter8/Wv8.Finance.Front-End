import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { TransactionsComponent } from "./transactions.component";
import { TransactionsOverviewComponent } from "./transactions-overview/transactions-overview.component";
import { TransactionComponent } from "./transaction/transaction.component";

const routes: Routes = [
  {
    path: "",
    component: TransactionsComponent,
    children: [
      {
        path: "",
        component: TransactionsOverviewComponent
      },
      {
        path: ":id",
        component: TransactionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}