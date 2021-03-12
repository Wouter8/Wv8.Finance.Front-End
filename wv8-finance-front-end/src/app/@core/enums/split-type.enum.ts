export enum SplitType {
  Equal = 1,
  Stakes = 2,
  Exact = 3,
}

export namespace SplitType {
  export function options() {
    var keys = Object.keys(SplitType);
    return keys.slice(keys.length / 2, keys.length - 1);
  }

  export function getIntervalunitString(type: SplitType): string {
    switch (type) {
      case SplitType.Equal:
        return "Equal";
      case SplitType.Stakes:
        return "Stakes";
      case SplitType.Exact:
        return "Exact";

      default:
        return "Unknown split type";
    }
  }
}
