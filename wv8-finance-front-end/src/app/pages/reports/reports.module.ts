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
import { Angular2SmartTableModule } from "angular2-smart-table";
import { FormsModule } from "@angular/forms";
import { NgxEchartsModule } from "ngx-echarts";

@NgModule({
  imports: [
    ReportsRoutingModule,
    NbCardModule,
    ThemeModule,
    NbIconModule,
    NbInputModule,
    Angular2SmartTableModule,
    NbCheckboxModule,
    NbDialogModule.forChild(),
    NbButtonModule,
    FormsModule,
    NbTooltipModule,
    NbDatepickerModule,
    NbStepperModule,
    NbFormFieldModule,
    NgxEchartsModule,
  ],
  declarations: [ReportsComponent],
})
export class ReportsModule {}
