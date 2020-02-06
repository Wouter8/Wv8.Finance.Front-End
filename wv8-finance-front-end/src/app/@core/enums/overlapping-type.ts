export enum OverlappingType {
    Bigger = 1,
    Smaller = 2,
    Partial = 3,
    Equal = 4,
}

export namespace OverlappingType {
  export function options() {
    var keys = Object.keys(OverlappingType);
    return keys.slice(keys.length / 2, keys.length - 1);
  }

  export function getOverlappingTypeString(type: OverlappingType): string {
    switch (type) {
      case OverlappingType.Bigger:
        return "Bigger";
      case OverlappingType.Equal:
        return "Equal";
      case OverlappingType.Partial:
        return "Partial";
      case OverlappingType.Smaller:
          return "Smaller";

      default:
        return "Unknown overlapping type";
    }
  }
}