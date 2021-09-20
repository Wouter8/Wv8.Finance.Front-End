import { DatePipe } from "@angular/common";
import { ReportIntervalUnit } from "../enums/report-interval-unit.enum";

export abstract class Report {
  public dates: Date[];
  public unit: ReportIntervalUnit;
}
