import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import {
  ITransaction,
  TransactionData,
  ITransactionGroup
} from "../data/transaction";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { HttpService } from "../utils/http.service";
import { Transaction } from "../models/transaction.model";
import { Maybe } from "@wv8/typescript.core";
import { TransactionType } from "../enums/transaction-type.enum";
import { TransactionGroup } from "../models/transaction-group.model";

@Injectable()
export class TransactionService extends TransactionData {
  private static BaseUrl = `${environment.base_url}/transactions`;

  constructor(private http: HttpService) {
    super();
  }

  getTransaction(id: number): Promise<Transaction> {
    const url = `${TransactionService.BaseUrl}/${id}`;

    return this.http
      .get<ITransaction>(url)
      .pipe(map(transaction => Transaction.fromDto(transaction)))
      .toPromise();
  }

  getTransactionsByFilter(
    type: Maybe<TransactionType>,
    accountId: Maybe<number>,
    description: Maybe<string>,
    categoryId: Maybe<number>,
    startDate: Maybe<Date>,
    endDate: Maybe<Date>,
    skip: number,
    take: number
  ): Promise<TransactionGroup> {
    const url = `${TransactionService.BaseUrl}/filter`;

    return this.http
      .get<ITransactionGroup>(url, {
        type: type.asEnumQueryParam(),
        accountId: accountId.asQueryParam(),
        description: description.asQueryParam(),
        categoryId: categoryId.asQueryParam(),
        startDate: startDate.map(d => d.toISOString()).asQueryParam(),
        endDate: endDate.map(d => d.toISOString()).asQueryParam(),
        skip,
        take
      })
      .pipe(map(group => TransactionGroup.fromDto(group)))
      .toPromise();
  }

  updateTransaction(
    id: number,
    accountId: number,
    description: string,
    date: Date,
    amount: number,
    categoryId: Maybe<number>,
    receivingAccountId: Maybe<number>
  ): Promise<Transaction> {
    const url = `${TransactionService.BaseUrl}/${id}`;

    return this.http
      .put<ITransaction>(url, {
        id,
        accountId,
        description,
        date: date.toISOString(),
        amount,
        categoryId: categoryId.asQueryParam(),
        receivingAccountId: receivingAccountId.asQueryParam()
      })
      .pipe(map(transaction => Transaction.fromDto(transaction)))
      .toPromise();
  }

  createTransaction(
    accountId: number,
    type: TransactionType,
    description: string,
    date: Date,
    amount: number,
    categoryId: Maybe<number>,
    receivingAccountId: Maybe<number>
  ): Promise<Transaction> {
    const url = `${TransactionService.BaseUrl}`;

    return this.http
      .post<ITransaction>(url, {
        accountId,
        type,
        description,
        date: date.toISOString(),
        amount,
        categoryId: categoryId.asQueryParam(),
        receivingAccountId: receivingAccountId.asQueryParam()
      })
      .pipe(map(transaction => Transaction.fromDto(transaction)))
      .toPromise();
  }

  confirmTransaction(
    id: number,
    date: Date,
    amount: number
  ): Promise<Transaction> {
    const url = `${TransactionService.BaseUrl}/${id}/confirm`;

    return this.http
      .put<ITransaction>(url, {
        id,
        date: date.toISOString(),
        amount
      })
      .pipe(map(transaction => Transaction.fromDto(transaction)))
      .toPromise();
  }

  deleteTransaction(id: number): Promise<void> {
    const url = `${TransactionService.BaseUrl}/${id}`;

    return this.http.delete<void>(url).toPromise();
  }
}
