import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReportsComponent } from "./reports.component";
import { ReportsRoutingModule } from "./reports-routing.module";
import {
  NbCardModule,
  NbIconModule,
  NbCheckboxModule,
  NbButtonModule,
  NbDialogModule,
  NbInputModule,
  NbTooltipModule,
  NbDatepickerModule,
  NbStepperModule,
  NbFormFieldModule,
} from "@nebular/theme";
import { ThemeModule } from "../../@theme/theme.module";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    ReportsRoutingModule,
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
    NbStepperModule,
    NbFormFieldModule,
  ],
  declarations: [ReportsComponent],
})
export class ReportsModule {}
