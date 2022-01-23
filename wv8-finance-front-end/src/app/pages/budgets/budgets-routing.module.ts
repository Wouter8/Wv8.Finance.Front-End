import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BudgetsComponent } from './budgets.component';
import { BudgetsOverviewComponent } from './budgets-overview/budgets-overview.component';
import { BudgetComponent } from './budget/budget.component';

const routes: Routes = [{
  path: '',
  component: BudgetsComponent,
  children: [
    {
      path: '',
      component: BudgetsOverviewComponent,
    },
    {
      path: ':id',
      component: BudgetComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetsRoutingModule {
}
