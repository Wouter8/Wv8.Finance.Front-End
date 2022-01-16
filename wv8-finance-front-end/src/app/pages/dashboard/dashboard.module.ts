import { NgModule } from "@angular/core";
import { NbCardModule, NbIconModule } from "@nebular/theme";

import { NgxEchartsModule } from "ngx-echarts";

import { ThemeModule } from "../../@theme/theme.module";
import { DashboardComponent } from "./dashboard.component";
import { CurrencyPipe, DatePipe } from "@angular/common";

@NgModule({
  imports: [NbCardModule, ThemeModule, NbIconModule, NgxEchartsModule],
  declarations: [DashboardComponent],
  providers: [CurrencyPipe, DatePipe]
})
export class DashboardModule {}
