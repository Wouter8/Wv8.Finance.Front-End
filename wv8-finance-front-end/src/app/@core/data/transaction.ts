import { Observable } from "rxjs";
import { TransactionType } from "../enums/transaction-type.enum";
import { ICategory } from "./category";
import { IntervalUnit } from "../enums/interval-unit";
import { Maybe, IMaybe } from "wv8.typescript.core";
import { Transaction } from "../models/transaction.model";
import { IAccount } from "./account";
import { TransactionGroup } from "../models/transaction-group.model";

export interface ITransaction {
  id: number;
  description: string;
  date: string;
  type: TransactionType;
  amount: number;
  categoryId: IMaybe<number>;
  category: IMaybe<ICategory>;
  accountId: number;
  account: IAccount;
  receivingAccountId: IMaybe<number>;
  receivingAccount: IMaybe<IAccount>;
  processed: boolean;
  recurringTransactionId: IMaybe<number>;
}

export interface ITransactionGroup {
  totalSearchResults: number;
  totalSum: number;
  sumPerIncomeCategory: Map<number, number>;
  sumPerExpenseCategory: Map<number, number>;
  transactionsPerCategory: Map<number, ITransaction[]>;
  transactionsPerType: Map<TransactionType, ITransaction[]>;
  transactions: ITransaction[];
  categories: ICategory[];
}

export abstract class TransactionData {
  abstract getTransaction(id: number): Promise<Transaction>;
  abstract getTransactionsByFilter(
    type: Maybe<TransactionType>,
    accountId: Maybe<number>,
    description: Maybe<string>,
    categoryId: Maybe<number>,
    startDate: Maybe<Date>,
    endDate: Maybe<Date>,
    skip: number,
    take: number
  ): Promise<TransactionGroup>;
  abstract updateTransaction(
    id: number,
    accountId: number,
    description: string,
    date: Date,
    amount: number,
    categoryId: Maybe<number>,
    receivingAccountId: Maybe<number>
  ): Promise<Transaction>;
  abstract createTransaction(
    accountId: number,
    type: TransactionType,
    description: string,
    date: Date,
    amount: number,
    categoryId: Maybe<number>,
    receivingAccountId: Maybe<number>
  ): Promise<Transaction>;
  abstract deleteTransaction(id: number): Promise<void>;
}
