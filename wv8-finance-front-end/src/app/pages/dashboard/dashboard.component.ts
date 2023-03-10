import { Component, OnInit } from "@angular/core";
import { ReportData } from "../../@core/data/report";
import { CurrentDateReport } from "../../@core/models/current-date-report.model";
import { NbThemeService } from "@nebular/theme";
import { EChartOption } from "echarts";
import { CurrencyPipe, DatePipe } from "@angular/common";

@Component({
  selector: "ngx-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  report: CurrentDateReport;
  netWorthChartOptions: EChartOption;
  balanceChartOptions: EChartOption;

  constructor(
    private reportService: ReportData,
    private themeService: NbThemeService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) {}

  async ngOnInit() {
    this.report = await this.reportService.getCurrentDateReport();
    this.setChartOptions();
  }

  private setChartOptions() {
    this.themeService.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.setNetWorthChartOptions(colors, echarts);
      this.setBalanceChartOptions(colors, echarts);
    });
  }

  private setBalanceChartOptions(colors: any, echarts: any) {
    let accounts = this.report.accounts
      .filter((a) => a.currentBalance > 0)
      .sort((a, b) =>
        a.currentBalance < b.currentBalance ? -1 : a.currentBalance > b.currentBalance ? 1 : 0
      );

    this.balanceChartOptions = {
      backgroundColor: echarts.bg,
      color: accounts.map((a) => a.icon.color),
      tooltip: {
        trigger: "item",
        formatter: (i: any) => `${i.name}: ${this.currencyPipe.transform(i.value, "EUR")}`,
      },
      grid: {
        left: "1%",
        right: "1%",
        bottom: "2%",
        top: "3%",
        containLabel: true,
      },
      series: [
        {
          radius: ["50%", "70%"],
          type: "pie",
          label: {
            show: true,
          },
          areaStyle: {
            opacity: echarts.areaOpacity,
          },
          data: accounts.map((a) => {
            return { value: a.currentBalance, name: a.description };
          }),
        },
      ],
    };
  }

  private setNetWorthChartOptions(colors: any, echarts: any) {
    this.netWorthChartOptions = {
      backgroundColor: echarts.bg,
      color: [colors.primaryLight],
      tooltip: {
        trigger: "axis",
        formatter: (i: any) =>
          `${this.datePipe.transform(i[0].name, "dd-MM-yyyy")}: ${this.currencyPipe.transform(
            i[0].value,
            "EUR"
          )}`,
      },
      grid: {
        left: "1%",
        right: "1%",
        bottom: "2%",
        top: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: Array.from(this.report.historicalBalance.keys()).map((d) => d.toISOString()),
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            formatter: (v) => `${this.datePipe.transform(v, "dd-MM-yyyy")}`,
          },
          axisLine: {
            lineStyle: {
              color: echarts.axisLineColor,
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: echarts.axisLineColor,
            },
          },
          axisLabel: {
            formatter: (v) => `${this.currencyPipe.transform(v, "EUR", "symbol", "1.0-0")}`,
          },
          splitLine: {
            lineStyle: {
              color: echarts.splitLineColor,
            },
          },
        },
      ],
      series: [
        {
          name: "Net worth",
          type: "line",
          areaStyle: {
            opacity: echarts.areaOpacity,
          },
          data: Array.from(this.report.historicalBalance.values()),
        },
      ],
    };
  }
}
