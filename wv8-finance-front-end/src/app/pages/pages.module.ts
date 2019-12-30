import { NgModule } from '@angular/core';
import { NbMenuModule, NbIconModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { AccountsModule } from './accounts/accounts.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    AccountsModule,
    NbIconModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
