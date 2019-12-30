import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountsComponent } from './accounts.component';
import { AccountComponent } from './account/account.component';
import { AccountsOverviewComponent } from './accounts-overview/accounts-overview.component';

const routes: Routes = [{
  path: '',
  component: AccountsComponent,
  children: [
    {
      path: '',
      component: AccountsOverviewComponent,
    },
    {
      path: ':id',
      component: AccountComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {
}
