import { of as observableOf, Observable, from } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpService } from "../utils/http.service";
import { Maybe } from "@wv8/typescript.core";
import { environment } from "../../../environments/environment";
import { RecurringTransaction } from "../models/recurring-transaction.model";
import { map } from "rxjs/operators";
import {
  RecurringTransactionData,
  IRecurringTransaction,
} from "../data/recurring-transaction";
import { TransactionType } from "../enums/transaction-type.enum";
import { IntervalUnit } from "../enums/interval-unit";
import { start } from "repl";
import { InputRecurringTransaction } from "../datatransfer/input-recurring-transaction";

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
        map((recurringtransaction) =>
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
        includeFinished,
      })
      .pipe(map((group) => group.map((rt) => RecurringTransaction.fromDto(rt))))
      .toPromise();
  }

  updateRecurringTransaction(
    id: number,
    input: InputRecurringTransaction,
    updateInstances: boolean
  ): Promise<RecurringTransaction> {
    const url = `${RecurringTransactionService.BaseUrl}/${id}`;

    return this.http
      .put<IRecurringTransaction>(
        url,
        {
          id,
          updateInstances,
        },
        input.serialize()
      )
      .pipe(
        map((recurringtransaction) =>
          RecurringTransaction.fromDto(recurringtransaction)
        )
      )
      .toPromise();
  }

  createRecurringTransaction(
    input: InputRecurringTransaction
  ): Promise<RecurringTransaction> {
    const url = `${RecurringTransactionService.BaseUrl}`;

    return this.http
      .post<IRecurringTransaction>(url, {}, input.serialize())
      .pipe(
        map((recurringtransaction) =>
          RecurringTransaction.fromDto(recurringtransaction)
        )
      )
      .toPromise();
  }

  deleteRecurringTransaction(
    id: number,
    deleteInstances: boolean
  ): Promise<void> {
    const url = `${RecurringTransactionService.BaseUrl}/${id}`;

    return this.http
      .delete<void>(url, { deleteInstances })
      .toPromise();
  }
}
