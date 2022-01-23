import { Maybe } from "@wv8/typescript.core";
import { IAccountReport } from "../data/report";
import { ReportIntervalUnit } from "../enums/report-interval-unit.enum";
import { Report } from "./report.model";

export class AccountReport extends Report {
  dates: Date[];
  unit: ReportIntervalUnit;
  balances: number[];

  public static fromDto(dto: IAccountReport): AccountReport {
    let instance = new AccountReport();

    instance.dates = dto.dates.map((d) => new Date(d));
    instance.unit = dto.unit;
    instance.balances = dto.balances;

    return instance;
  }
}
