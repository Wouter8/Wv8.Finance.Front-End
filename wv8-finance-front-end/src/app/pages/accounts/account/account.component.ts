import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IAccount, AccountData } from "../../../@core/data/account";
import { Maybe } from "@wv8/typescript.core";
import { NbDateService, NbDialogService, NbToastrService } from "@nebular/theme";
import { CreateOrEditAccountComponent } from "../create-or-edit-account/create-or-edit-account.component";
import { Account } from "../../../@core/models/account.model";
import { ConfirmDialogComponent } from "../../../@theme/components/confirm-dialog/confirm-dialog.component";
import { ReportData } from "../../../@core/data/report";
import { AccountReport } from "../../../@core/models/account-report.model";
import { EChartOption } from "echarts";
import { ChartTooltip } from "../../../@core/models/chart-tooltip/chart-tooltip.model";
import { CurrencyPipe } from "@angular/common";

@Component({
  selector: "account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"]
})
export class AccountComponent implements OnInit {
  account: Account;
  report: AccountReport;

  balanceChartOptions: EChartOption;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountData,
    private reportService: ReportData,
    private dateService: NbDateService<Date>,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService,
    private currencyPipe: CurrencyPipe
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      let id = new Maybe<number>(params.id);
      if (id.isSome) {
        try {
          this.account = await this.accountService.getAccount(id.value);

          let today = new Date();
          let startOfMonth = this.dateService.getMonthStart(today);
          let start = this.dateService.addMonth(startOfMonth, -11);
          this.report = await this.reportService.getAccountReport(id.value, start, today);

          this.balanceChartOptions = this.getChartOptions(this.report);
        } catch {
          this.toasterService.danger("", "Account not found");
          this.router.navigateByUrl("/accounts");
        }
      } else {
        this.router.navigateByUrl("/accounts");
      }
    });
  }

  async onObsoleteClick() {
    if (this.account.isObsolete) {
      await this.accountService.setAccountObsolete(this.account.id, false);

      this.account.isObsolete = false;
      this.toasterService.success("", "Recovered account");
    } else {
      this.dialogService
        .open(ConfirmDialogComponent, {
          context: { body: `Mark ${this.account.description} obsolete?` }
        })
        .onClose.subscribe(async (confirmed: boolean) => {
          if (confirmed) {
            await this.accountService.setAccountObsolete(this.account.id, true);

            this.account.isObsolete = true;
            this.account.isDefault = false;
            this.toasterService.success("", "Marked account obsolete");
          }
        });
    }
  }

  async onEditClick() {
    this.dialogService
      .open(CreateOrEditAccountComponent, {
        context: { account: this.account.copy() }
      })
      .onClose.subscribe(
        async (data: { success: boolean; account: Account }) => {
          if (data && data.success) {
            this.toasterService.success("", "Updated account");
          }
        }
      );
  }

  private getChartOptions(report: AccountReport): EChartOption {
    return {
      color: ["#598bff"],
      tooltip: {
        trigger: "axis",
        formatter: (data) => {
          let date = this.report.dates[data[0].dataIndex].toIntervalTooltip(
            this.report.unit
          );

          return ChartTooltip.create(date)
            .addEuroRow(data[0])
            .render();
        },
      },
      grid: {
        left: "0px",
        right: "0px",
        bottom: "5px",
        top: "5px",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: report.dates.map((d) => d.toIntervalString(this.report.unit)),
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            formatter: (v) =>
              this.currencyPipe.transform(
                Math.abs(v),
                "EUR",
                "symbol",
                "1.0-0"
              ),
          },
        },
      ],
      series: [
        {
          name: "Balance",
          type: "line",
          data: report.balances,
          areaStyle: {
            opacity: 0.5
          },
        },
      ]
    };
  }
}
