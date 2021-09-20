import { Account } from "../models/account.model";
import { ITransaction } from "./transaction";
import { IAccount } from "./account";
import { IBudget } from "./budget";
import { CurrentDateReport } from "../models/current-date-report.model";
import { ReportIntervalUnit } from "../enums/report-interval-unit.enum";
import { CategoryReport } from "../models/category-report.model";
import { IMaybe } from "@wv8/typescript.core";

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

export abstract class ReportData {
  abstract getCurrentDateReport(): Promise<CurrentDateReport>;
  abstract getCategoryReport(
    categoryId: number,
    start: Date,
    end: Date
  ): Promise<CategoryReport>;
}
