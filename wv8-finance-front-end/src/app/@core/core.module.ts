import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  LOCALE_ID
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { NbAuthModule, NbDummyAuthStrategy } from "@nebular/auth";
import { NbSecurityModule, NbRoleProvider } from "@nebular/security";
import { of as observableOf } from "rxjs";

import { Ng2SmartTableModule } from "ng2-smart-table";

import { throwIfAlreadyLoaded } from "./module-import-guard";
import { AnalyticsService } from "./utils";
import { MenuItemsService } from "./utils/menu-items.service";
import { AccountData } from "./data/account";
import { CategoryData } from "./data/category";
import { BudgetData } from "./data/budget";
import { AccountService } from "./services/account.service";
import { HttpService } from "./utils/http.service";
import { CategoryService } from "./services/category.service";

const DATA_SERVICES = [
  { provide: AccountData, useClass: AccountService },
  { provide: CategoryData, useClass: CategoryService }
];

const UTIL_SERVICES = [AnalyticsService, MenuItemsService, HttpService];

export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf("guest");
  }
}

export const NB_CORE_PROVIDERS = [...DATA_SERVICES, ...UTIL_SERVICES];

@NgModule({
  imports: [CommonModule],
  exports: [NbAuthModule],
  declarations: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, "CoreModule");
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [...NB_CORE_PROVIDERS]
    };
  }
}
