import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from './users.service';
import { AccountService } from './account.service';
import { BudgetService } from './budget.service';
import { RecurringBudgetService } from './recurring-budget.service';
import { CategoryService } from './category.service';

const SERVICES = [
  UserService,
  AccountService,
  BudgetService,
  RecurringBudgetService,
  CategoryService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class MockDataModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: MockDataModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
