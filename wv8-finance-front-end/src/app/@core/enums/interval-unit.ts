export enum IntervalUnit {
    Days = 1,
    Weeks = 2,
    Months = 3,
    Years = 4
  }
  
  export namespace IntervalUnit {
    export function options() {
      var keys = Object.keys(IntervalUnit);
      return keys.slice(keys.length / 2, keys.length - 1);
    }
  
    export function getIntervalunitString(type: IntervalUnit): string {
      switch (type) {
        case IntervalUnit.Days:
          return "Days";
        case IntervalUnit.Weeks:
          return "Weeks";
          case IntervalUnit.Months:
            return "Months";
          case IntervalUnit.Years:
            return "Years";
  
        default:
          return "Unknown category type";
      }
    }
  }
  