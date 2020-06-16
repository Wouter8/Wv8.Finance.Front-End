export enum TransactionType {
  External = 1,
  Internal = 2
}

export namespace TransactionType {
  export function options() {
    var keys = Object.keys(TransactionType);
    return keys.slice(keys.length / 2, keys.length - 1);
  }

  export function getTransactionTypeString(type: TransactionType): string {
    switch (type) {
      case TransactionType.External:
        return "External";
      case TransactionType.Internal:
        return "Internal";

      default:
        return "Unknown transaction type";
    }
  }
}
