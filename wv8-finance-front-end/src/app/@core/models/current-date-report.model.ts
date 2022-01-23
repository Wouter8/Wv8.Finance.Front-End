import { Transaction } from "./transaction.model";
import { Budget } from "./budget.model";
import { IAccount } from "../data/account";
import { Account } from "./account.model";
import { ICurrentDateReport } from "../data/report";

export class CurrentDateReport {
  latestTransactions: Transaction[];
  upcomingTransactions: Transaction[];
  unconfirmedTransactions: Transaction[];
  accounts: Account[];
  netWorth: number;
  historicalBalance: Map<Date, number>;
  budgets: Budget[];

  public static fromDto(dto: ICurrentDateReport): CurrentDateReport {
    let instance = new CurrentDateReport();

    instance.latestTransactions = dto.latestTransactions.map(t =>
      Transaction.fromDto(t)
    );
    instance.upcomingTransactions = dto.upcomingTransactions.map(t =>
      Transaction.fromDto(t)
    );
    instance.unconfirmedTransactions = dto.unconfirmedTransactions.map(t =>
      Transaction.fromDto(t)
    );
    instance.accounts = dto.accounts.map(a => Account.fromDto(a));
    instance.netWorth = dto.netWorth;
    instance.historicalBalance = new Map();
    for (let key in dto.historicalBalance) {
      let date = new Date(key);
      let value = dto.historicalBalance[key];
      instance.historicalBalance.set(date, value);
    }
    instance.budgets = dto.budgets.map(b => Budget.fromDto(b));

    return instance;
  }
}
