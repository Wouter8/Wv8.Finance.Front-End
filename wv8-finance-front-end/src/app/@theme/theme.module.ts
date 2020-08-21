import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbTooltipModule,
  NbCardModule,
  NbPopoverModule,
  NbProgressBarModule,
  NbDatepickerModule,
  NbInputModule,
  NbAutocompleteModule,
  NbTabsetModule,
  NbFormFieldModule,
  NbCheckboxModule
} from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { NbSecurityModule } from "@nebular/security";

import {
  FooterComponent,
  HeaderComponent,
  SwitcherComponent
} from "./components";
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe
} from "./pipes";
import { LayoutComponent } from "./layouts";
import { DEFAULT_THEME } from "./styles/theme.default";
import { COSMIC_THEME } from "./styles/theme.cosmic";
import { CORPORATE_THEME } from "./styles/theme.corporate";
import { DARK_THEME } from "./styles/theme.dark";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { TableComponent } from "./components/table/table.component";
import { TableEuroCellComponent } from "./components/table/table-euro-cell/table-euro-cell.component";
import { TableBooleanCellComponent } from "./components/table/table-boolean-cell/table-boolean-cell.component";
import { TableObsoleteCellComponent } from "./components/table/table-obsolete-cell/table-obsolete-cell.component";
import { TableDefaultAndObsoleteCellComponent } from "./components/table/table-default-and-obsolete-cell/table-default-and-obsolete-cell.component";
import { TableIconCellComponent } from "./components/table/table-icon-cell/table-icon-cell.component";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { ObsoleteContainerComponent } from "./components/obsolete-container/obsolete-container.component";
import { FontAwesomeIconPickerComponent } from "./components/font-awesome-icon-picker/font-awesome-icon-picker.component";
import { IconWithBackgroundComponent } from "./components/icon-with-background/icon-with-background.component";
import { ColorPickerComponent } from "./components/color-picker/color-picker.component";
import { TableNameCellComponent } from "./components/table/table-name-cell/table-name-cell.component";
import { EnumToArrayPipe } from "./pipes/enum-to-array.pipe";
import { TableDateCellComponent } from "./components/table/table-date-cell/table-date-cell.component";
import { TableProgressCellComponent } from "./components/table/table-progress-cell/table-progress-cell.component";
import { IntervalPickerComponent } from "./components/interval-picker/interval-picker.component";
import { CategoryPickerComponent } from "./components/category-picker/category-picker.component";
import { FormsModule } from "@angular/forms";
import { TableTransactionTypeIconCellComponent } from "./components/table/table-transaction-type-icon-cell/table-transaction-type-icon-cell.component";
import { AccountPickerComponent } from "./components/account-picker/account-picker.component";
import { DatePickerComponent } from "./components/date-picker/date-picker.component";
import { PeriodPickerComponent } from "./components/period-picker/period-picker.component";
import { TransactionTableComponent } from "./components/transaction-table/transaction-table.component";
import { BudgetsTableComponent } from "./components/budgets-table/budgets-table.component";
import { CreateOrEditTransactionComponent } from './components/create-or-edit-transaction/create-or-edit-transaction.component';
import { TableMaybeDateCellComponent } from './components/table/table-maybe-date-cell/table-maybe-date-cell.component';
import { CreateOrEditIncomeComponent } from './components/create-or-edit-transaction/create-or-edit-income/create-or-edit-income.component';
import { CreateOrEditExpenseComponent } from './components/create-or-edit-transaction/create-or-edit-expense/create-or-edit-expense.component';
import { CreateOrEditTransferComponent } from './components/create-or-edit-transaction/create-or-edit-transfer/create-or-edit-transfer.component';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbCardModule,
  NbIconModule,
  NbEvaIconsModule,
  Ng2SmartTableModule,
  NbTooltipModule,
  NbPopoverModule,
  NbProgressBarModule,
  NbDatepickerModule,
  NbInputModule,
  NbAutocompleteModule,
  NbTabsetModule,
  NbFormFieldModule,
  NbCheckboxModule,
];
const COMPONENTS = [
  SwitcherComponent,
  HeaderComponent,
  FooterComponent,
  LayoutComponent,
  TableComponent,
  TableEuroCellComponent,
  TableBooleanCellComponent,
  TableObsoleteCellComponent,
  TableDefaultAndObsoleteCellComponent,
  TableIconCellComponent,
  ConfirmDialogComponent,
  ObsoleteContainerComponent,
  FontAwesomeIconPickerComponent,
  IconWithBackgroundComponent,
  ColorPickerComponent,
  TableNameCellComponent,
  TableDateCellComponent,
  TableProgressCellComponent,
  IntervalPickerComponent,
  CategoryPickerComponent,
  TableTransactionTypeIconCellComponent,
  AccountPickerComponent,
  DatePickerComponent,
  PeriodPickerComponent,
  TransactionTableComponent,
  BudgetsTableComponent,
  CreateOrEditIncomeComponent,
  CreateOrEditExpenseComponent,
  CreateOrEditTransferComponent,
  CreateOrEditTransactionComponent,
  TableMaybeDateCellComponent
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
  EnumToArrayPipe
];
const ENTRY_COMPONENTS = [
  TableBooleanCellComponent,
  TableEuroCellComponent,
  TableObsoleteCellComponent,
  TableDefaultAndObsoleteCellComponent,
  TableIconCellComponent,
  ConfirmDialogComponent,
  FontAwesomeIconPickerComponent,
  ColorPickerComponent,
  TableNameCellComponent,
  TableDateCellComponent,
  TableProgressCellComponent,
  TableTransactionTypeIconCellComponent,
];
const IMPORT_MODULES = [FormsModule];

@NgModule({
  imports: [CommonModule, ...NB_MODULES, ...IMPORT_MODULES],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [...ENTRY_COMPONENTS]
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME ],
        ).providers,
      ],
    };
  }
}
