export enum CategoryType {
  Expense = 1,
  Income = 2,
}

export namespace CategoryType {
  export function options() {
    var keys = Object.keys(CategoryType);
    return keys.slice(keys.length / 2, keys.length - 1);
  }

  export function getCategoryTypeString(type: CategoryType): string {
    switch (type) {
      case CategoryType.Expense:
        return "Expense";
      case CategoryType.Income:
        return "Income";

      default:
        return "Unknown category type";
    }
  }
}
