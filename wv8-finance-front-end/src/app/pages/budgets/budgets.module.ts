import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NbCardModule,
  NbIconModule,
  NbCheckboxModule,
  NbButtonModule,
  NbDialogModule,
  NbInputModule,
  NbTooltipModule,
  NbDatepickerModule,
  NbStepperModule
} from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule } from "@angular/forms";
import { BudgetsComponent } from "./budgets.component";
import { BudgetComponent } from "./budget/budget.component";
import { CreateOrEditBudgetComponent } from "./create-or-edit-budget/create-or-edit-budget.component";
import { BudgetsRoutingModule } from "./budgets-routing.module";
import { BudgetsOverviewComponent } from "./budgets-overview/budgets-overview.component";
@NgModule({
  imports: [
    BudgetsRoutingModule,
    NbCardModule,
    ThemeModule,
    NbIconModule,
    NbInputModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
    NbDialogModule.forChild(),
    NbButtonModule,
    FormsModule,
    NbTooltipModule,
    NbDatepickerModule,
    NbStepperModule
  ],
  declarations: [
    BudgetsComponent,
    BudgetComponent,
    CreateOrEditBudgetComponent,
    BudgetsOverviewComponent
  ],
  entryComponents: [CreateOrEditBudgetComponent]
})
export class BudgetsModule {}
