import { DatePipe, TitleCasePipe } from "@angular/common";
import { ReportIntervalUnit } from "../enums/report-interval-unit.enum";

declare global {
  interface Date {
    toIntervalString(unit: ReportIntervalUnit);
    toIntervalTooltip(unit: ReportIntervalUnit);
  }
}

export class DateUtils {
  public static overwriteMethods() {
    DateUtils.overwriteToDateString();
    DateUtils.overwriteToIntervalString();
    DateUtils.overwriteToIntervalTooltip();
  }

  private static overwriteToDateString() {
    Date.prototype.toDateString = function () {
      const datepipe: DatePipe = new DatePipe("nl-NL");
      return datepipe.transform(this, "yyyy-MM-dd");
    };
  }

  private static overwriteToIntervalString(): void {
    Date.prototype.toIntervalString = function (unit) {
      const datepipe: DatePipe = new DatePipe("nl-NL");

      switch (unit) {
        case ReportIntervalUnit.Days:
          return datepipe.transform(this, "d MMM").slice(0, -1);
        case ReportIntervalUnit.Weeks:
          return datepipe.transform(this, "'wk'ww");
        case ReportIntervalUnit.Months:
          return datepipe.transform(this, "MMM").slice(0, -1);
        case ReportIntervalUnit.Years:
          return datepipe.transform(this, "yyyy");
      }
    };
  }

  private static overwriteToIntervalTooltip(): void {
    Date.prototype.toIntervalTooltip = function (unit) {
      const datepipe: DatePipe = new DatePipe("nl-NL");
      const titleCasePipe: TitleCasePipe = new TitleCasePipe();

      switch (unit) {
        case ReportIntervalUnit.Days:
          return datepipe.transform(this, "d MMMM yyyy");
        case ReportIntervalUnit.Weeks:
          return datepipe.transform(this, "'wk'ww yyyy");
        case ReportIntervalUnit.Months:
          return titleCasePipe.transform(datepipe.transform(this, "MMMM yyyy"));
        case ReportIntervalUnit.Years:
          return datepipe.transform(this, "yyyy");
      }
    };
  }
}
