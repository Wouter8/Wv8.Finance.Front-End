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
  NbProgressBarModule
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
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { TableNameCellComponent } from './components/table/table-name-cell/table-name-cell.component';
import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';
import { TableDateCellComponent } from './components/table/table-euro-cell copy/table-date-cell.component';
import { TableProgressCellComponent } from './components/table/table-progress-cell/table-progress-cell.component';
import { IntervalPickerComponent } from './components/interval-picker/interval-picker.component';
import { CategoryPickerComponent } from './components/category-picker/category-picker.component';

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
  NbProgressBarModule
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
];

@NgModule({
  imports: [CommonModule, ...NB_MODULES],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [...ENTRY_COMPONENTS]
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: "default"
          },
          [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME]
        ).providers
      ]
    };
  }
}