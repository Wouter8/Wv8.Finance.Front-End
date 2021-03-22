export enum AccountType {
    Normal = 1,
    Splitwise = 2,
}

export namespace AccountType {
  export function options() {
    var keys = Object.keys(AccountType);
    return keys.slice(keys.length / 2, keys.length - 1);
  }

  export function getAccountTypeString(type: AccountType): string {
    switch (type) {
      case AccountType.Normal:
        return "Normal";
      case AccountType.Splitwise:
        return "Splitwise";

      default:
        return "Unknown account type";
    }
  }
}
