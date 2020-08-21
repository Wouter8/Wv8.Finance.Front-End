export enum TransactionType {
  Expense = 1,
  Income = 2,
  Transfer = 3,
}

export namespace TransactionType {
  export function options() {
    var keys = Object.keys(TransactionType);
    return keys.slice(keys.length / 2, keys.length - 1);
  }

  export function getTransactionTypeString(type: TransactionType): string {
    switch (type) {
      case TransactionType.Expense:
        return "Expense";
      case TransactionType.Income:
        return "Income";
      case TransactionType.Transfer:
        return "Transfer";

      default:
        return "Unknown transaction type";
    }
  }
}
