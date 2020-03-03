import { Observable } from "rxjs";
import { TransactionType } from "../enums/transaction-type.enum";
import { ICategory } from "./category";
import { IntervalUnit } from "../enums/interval-unit";
import { Maybe, IMaybe } from "wv8.typescript.core";
import { Transaction } from "../models/transaction.model";
import { IAccount } from "./account";
import { TransactionGroup } from "../models/transaction-group.model";
import { RecurringTransaction } from "../models/recurring-transaction.model";

export interface IRecurringTransaction {
  id: number;
  description: string;
  startDate: string;
  endDate: string;
  type: TransactionType;
  amount: number;
  categoryId: IMaybe<number>;
  category: IMaybe<ICategory>;
  accountId: number;
  account: IAccount;
  receivingAccountId: IMaybe<number>;
  receivingAccount: IMaybe<IAccount>;
  nextOccurence: IMaybe<string>;
  finished: boolean;
  intervalUnit: IntervalUnit;
  interval: number;
  needsConfirmation: boolean;
}

export abstract class RecurringTransactionData {
  abstract getRecurringTransaction(id: number): Promise<RecurringTransaction>;
  abstract getRecurringTransactionsByFilter(
    type: Maybe<TransactionType>,
    accountId: Maybe<number>,
    categoryId: Maybe<number>,
    includeFinished: boolean
  ): Promise<RecurringTransaction[]>;
  abstract updateRecurringTransaction(
    id: number,
    accountId: number,
    description: string,
    startDate: Date,
    endDate: Date,
    amount: number,
    categoryId: Maybe<number>,
    receivingAccountId: Maybe<number>,
    interval: number,
    intervalUnit: IntervalUnit,
    needsConfirmation: boolean,
    updateInstances: boolean
  ): Promise<RecurringTransaction>;
  abstract createRecurringTransaction(
    accountId: number,
    type: TransactionType,
    description: string,
    startDate: Date,
    endDate: Date,
    amount: number,
    categoryId: Maybe<number>,
    receivingAccountId: Maybe<number>,
    interval: number,
    intervalUnit: IntervalUnit,
    needsConfirmation: boolean
  ): Promise<RecurringTransaction>;
  abstract deleteRecurringTransaction(
    id: number,
    deleteInstances: boolean
  ): Promise<void>;
}
