import { Account } from "../models/account.model";
import { ITransaction } from "./transaction";
import { IAccount } from "./account";
import { IBudget } from "./budget";
import { CurrentDateReport } from "../models/current-date-report.model";
import { ReportIntervalUnit } from "../enums/report-interval-unit.enum";
import { CategoryReport } from "../models/category-report.model";
import { IMaybe } from "@wv8/typescript.core";
import { AccountReport } from "../models/account-report.model";

export interface ICurrentDateReport {
  latestTransactions: ITransaction[];
  upcomingTransactions: ITransaction[];
  unconfirmedTransactions: ITransaction[];
  accounts: IAccount[];
  netWorth: number;
  historicalBalance: Map<string, number>;
  budgets: IBudget[];
}

interface IReport {
  dates: string[];
  unit: ReportIntervalUnit;
}

export interface ICategoryReport extends IReport {
  expenses: number[];
  incomes: number[];
  results: IMaybe<number[]>;
}

export interface IAccountReport extends IReport {
  balances: number[];
}

export abstract class ReportData {
  abstract getCurrentDateReport(): Promise<CurrentDateReport>;
  abstract getCategoryReport(
    categoryId: number,
    start: Date,
    end: Date
  ): Promise<CategoryReport>;
  abstract getAccountReport(
    accountId: number,
    start: Date,
    end: Date
  ): Promise<AccountReport>;
}
