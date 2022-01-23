import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AccountsComponent } from "./accounts/accounts.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "accounts",
        loadChildren: () =>
          import("./accounts/accounts.module").then(m => m.AccountsModule)
      },
      {
        path: "categories",
        loadChildren: () =>
          import("./categories/categories.module").then(m => m.CategoriesModule)
      },
      {
        path: "budgets",
        loadChildren: () =>
          import("./budgets/budgets.module").then(m => m.BudgetsModule)
      },
      {
        path: "transactions",
        loadChildren: () =>
          import("./transactions/transactions.module").then(
            m => m.TransactionsModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
