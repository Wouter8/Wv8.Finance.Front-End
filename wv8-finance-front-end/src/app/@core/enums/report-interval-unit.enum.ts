export enum ReportIntervalUnit {
  Days = 1,
  Weeks = 2,
  Months = 3,
  Years = 4,
}

export namespace ReportIntervalUnit {
  export function options() {
    var keys = Object.keys(ReportIntervalUnit);
    return keys.slice(keys.length / 2, keys.length - 1);
  }

  export function getReportIntervalUnitString(
    type: ReportIntervalUnit
  ): string {
    switch (type) {
      case ReportIntervalUnit.Days:
        return "Days";
      case ReportIntervalUnit.Weeks:
        return "Weeks";
      case ReportIntervalUnit.Months:
        return "Months";
      case ReportIntervalUnit.Years:
        return "Years";

      default:
        return "Unknown report interval unit";
    }
  }
}
