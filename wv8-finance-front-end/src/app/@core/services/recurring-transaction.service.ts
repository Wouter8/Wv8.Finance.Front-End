import { of as observableOf, Observable, from } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpService } from "../utils/http.service";
import { Maybe } from "wv8.typescript.core";
import { environment } from "../../../environments/environment";
import { RecurringTransaction } from "../models/recurring-transaction.model";
import { map } from "rxjs/operators";
import {
  RecurringTransactionData,
  IRecurringTransaction
} from "../data/recurring-transaction";
import { TransactionType } from "../enums/transaction-type.enum";
import { IntervalUnit } from "../enums/interval-unit";

@Injectable()
export class RecurringTransactionService extends RecurringTransactionData {
  private static BaseUrl = `${environment.base_url}/transactions/recurring`;

  constructor(private http: HttpService) {
    super();
  }

  getRecurringTransaction(id: number): Promise<RecurringTransaction> {
    const url = `${RecurringTransactionService.BaseUrl}/${id}`;

    return this.http
      .get<IRecurringTransaction>(url)
      .pipe(
        map(recurringtransaction =>
          RecurringTransaction.fromDto(recurringtransaction)
        )
      )
      .toPromise();
  }

  getRecurringTransactionsByFilter(
    type: Maybe<TransactionType>,
    accountId: Maybe<number>,
    categoryId: Maybe<number>,
    includeFinished: boolean
  ): Promise<RecurringTransaction[]> {
    const url = `${RecurringTransactionService.BaseUrl}/filter`;

    return this.http
      .get<IRecurringTransaction[]>(url, {
        type: type.asEnumQueryParam(),
        accountId: accountId.asQueryParam(),
        categoryId: categoryId.asQueryParam(),
        includeFinished
      })
      .pipe(map(group => group.map(rt => RecurringTransaction.fromDto(rt))))
      .toPromise();
  }

  updateRecurringTransaction(
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
  ): Promise<RecurringTransaction> {
    const url = `${RecurringTransactionService.BaseUrl}/${id}`;

    return this.http
      .put<IRecurringTransaction>(url, {
        id,
        accountId,
        description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount,
        categoryId: categoryId.asQueryParam(),
        receivingAccountId: receivingAccountId.asQueryParam(),
        interval,
        intervalUnit,
        needsConfirmation,
        updateInstances
      })
      .pipe(
        map(recurringtransaction =>
          RecurringTransaction.fromDto(recurringtransaction)
        )
      )
      .toPromise();
  }

  createRecurringTransaction(
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
  ): Promise<RecurringTransaction> {
    const url = `${RecurringTransactionService.BaseUrl}`;

    return this.http
      .post<IRecurringTransaction>(url, {
        accountId,
        type,
        description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount,
        categoryId: categoryId.asQueryParam(),
        receivingAccountId: receivingAccountId.asQueryParam(),
        interval,
        intervalUnit,
        needsConfirmation
      })
      .pipe(
        map(recurringtransaction =>
          RecurringTransaction.fromDto(recurringtransaction)
        )
      )
      .toPromise();
  }

  deleteRecurringTransaction(id: number): Promise<void> {
    const url = `${RecurringTransactionService.BaseUrl}/${id}`;

    return this.http.delete<void>(url).toPromise();
  }
}
