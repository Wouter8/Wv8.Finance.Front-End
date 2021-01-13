import { Observable } from "rxjs";
import { TransactionType } from "../enums/transaction-type.enum";
import { ICategory } from "./category";
import { IntervalUnit } from "../enums/interval-unit";
import { Maybe, IMaybe } from "@wv8/typescript.core";
import { Transaction } from "../models/transaction.model";
import { IAccount } from "./account";
import { TransactionGroup } from "../models/transaction-group.model";
import { IRecurringTransaction } from "./recurring-transaction";
import { InputTransaction } from '../datatransfer/input-transaction';
import { EditTransaction } from '../datatransfer/edit-transaction';

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
  recurringTransaction: IMaybe<IRecurringTransaction>;
  needsConfirmation: boolean;
  isConfirmed: IMaybe<boolean>;
  paymentRequests: IPaymentRequest[];
  personalAmount: number;
}

export interface IPaymentRequest {
  id: number;
  transactionId: number;
  amount: number;
  name: string;
  count: number;
  paidCount: number;
  amountDue: number;
  complete: boolean;
}

export interface ITransactionGroup {
  totalSearchResults: number;
  totalSum: number;
  sumPerCategory: Map<number, number>;
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
  abstract updateTransaction(input: EditTransaction): Promise<Transaction>;
  abstract createTransaction(input: InputTransaction): Promise<Transaction>;
  abstract confirmTransaction(
    id: number,
    date: Date,
    amount: number
  ): Promise<Transaction>;
  abstract deleteTransaction(id: number): Promise<void>;
}
