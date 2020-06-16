export enum TransactionFlowType {
  Expense = 1,
  Income = 2,
  Transfer = 3,
}

export namespace TransactionFlowType {
  export function options() {
    var keys = Object.keys(TransactionFlowType);
    return keys.slice(keys.length / 2, keys.length - 1);
  }

  export function getTransactionTypeString(type: TransactionFlowType): string {
    switch (type) {
      case TransactionFlowType.Expense:
        return "Expense";
      case TransactionFlowType.Income:
        return "Income";
      case TransactionFlowType.Transfer:
        return "Transfer";

      default:
        return "Unknown transaction type";
    }
  }
}
