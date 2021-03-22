import { Observable } from "rxjs";
import { TransactionType } from "../enums/transaction-type.enum";
import { ICategory } from "./category";
import { IntervalUnit } from "../enums/interval-unit";
import { Maybe, IMaybe } from "@wv8/typescript.core";
import { Transaction } from "../models/transaction.model";
import { IAccount } from "./account";
import { TransactionGroup } from "../models/transaction-group.model";
import { IRecurringTransaction } from "./recurring-transaction";
import { InputTransaction } from "../datatransfer/input-transaction";
import { ImportState } from "../enums/import-state.enum";
import { SplitwiseTransaction } from "../models/splitwise-transaction.model";
import { SplitwiseUser } from "../models/splitwise-user.model";
import { ImportResult } from "../enums/import-result.enum";
import { ImporterInformation } from "../models/importer-information.model";

export interface ISplitwiseTransaction {
  id: number;
  description: string;
  date: string;
  isDeleted: boolean;
  imported: boolean;
  paidAmount: number;
  personalAmount: number;
  owedToOthers: number;
  owedByOthers: number;
}

export interface ISplitwiseUser {
  id: number;
  name: string;
}

export interface IImporterInformation {
  lastRunTimestamp: string;
  currentState: ImportState;
}

export abstract class ISplitwiseData {
  abstract getSplitwiseTransactions(
    onlyImportable: boolean
  ): Promise<SplitwiseTransaction[]>;
  abstract getSplitwiseUsers(): Promise<SplitwiseUser[]>;
  abstract completeTransactionImport(
    splitwiseId: number,
    categoryId: number,
    accountId: Maybe<number>
  ): Promise<Transaction>;
  abstract importFromSplitwise(): Promise<ImportResult>;
  abstract getImporterInformation(): Promise<ImporterInformation>;
}
