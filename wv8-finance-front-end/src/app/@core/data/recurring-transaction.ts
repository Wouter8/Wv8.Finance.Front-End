import { Observable } from "rxjs";
import { TransactionType } from "../enums/transaction-type.enum";
import { ICategory } from "./category";
import { IntervalUnit } from "../enums/interval-unit";
import { Maybe, IMaybe } from "@wv8/typescript.core";
import { Transaction } from "../models/transaction.model";
import { IAccount } from "./account";
import { TransactionGroup } from "../models/transaction-group.model";
import { RecurringTransaction } from "../models/recurring-transaction.model";
import { InputRecurringTransaction } from "../datatransfer/input-recurring-transaction";
import { IBaseTransaction } from "./transaction";

export interface IRecurringTransaction extends IBaseTransaction {
  startDate: string;
  endDate: IMaybe<string>;
  nextOccurence: IMaybe<string>;
  finished: boolean;
  intervalUnit: IntervalUnit;
  interval: number;
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
    input: InputRecurringTransaction,
    updateInstances: boolean
  ): Promise<RecurringTransaction>;
  abstract createRecurringTransaction(
    input: InputRecurringTransaction
  ): Promise<RecurringTransaction>;
  abstract deleteRecurringTransaction(
    id: number,
    deleteInstances: boolean
  ): Promise<void>;
}
