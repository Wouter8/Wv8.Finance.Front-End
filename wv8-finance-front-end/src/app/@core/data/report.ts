import { Account } from "../models/account.model";
import { ITransaction } from "./transaction";
import { IAccount } from "./account";
import { IBudget } from "./budget";
import { CurrentDateReport } from "../models/current-date-report.model";

export interface ICurrentDateReport {
  latestTransactions: ITransaction[];
  upcomingTransactions: ITransaction[];
  unconfirmedTransactions: ITransaction[];
  accounts: IAccount[];
  netWorth: number;
  historicalBalance: Map<string, number>;
  budgets: IBudget[];
}

export abstract class ReportData {
  abstract getCurrentDateReport(): Promise<CurrentDateReport>;
}
