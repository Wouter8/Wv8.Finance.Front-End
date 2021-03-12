import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import {
  ITransaction,
  TransactionData,
  ITransactionGroup,
} from "../data/transaction";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { HttpService } from "../utils/http.service";
import { Transaction } from "../models/transaction.model";
import { Maybe } from "@wv8/typescript.core";
import { TransactionType } from "../enums/transaction-type.enum";
import { TransactionGroup } from "../models/transaction-group.model";
import { InputTransaction } from "../datatransfer/input-transaction";
import {
  IImporterInformation,
  ISplitwiseData,
  ISplitwiseTransaction,
  ISplitwiseUser,
} from "../data/splitwise";
import { ImportResult } from "../enums/import-result.enum";
import { ImporterInformation } from "../models/importer-information.model";
import { SplitwiseTransaction } from "../models/splitwise-transaction.model";
import { SplitwiseUser } from "../models/splitwise-user.model";

@Injectable()
export class SplitwiseService implements ISplitwiseData {
  private static BaseUrl = `${environment.base_url}/splitwise`;

  constructor(private http: HttpService) {}

  getSplitwiseTransactions(
    onlyImportable: boolean
  ): Promise<SplitwiseTransaction[]> {
    const url = `${SplitwiseService.BaseUrl}/transactions`;

    return this.http
      .get<ISplitwiseTransaction[]>(url, { onlyImportable })
      .pipe(
        map((transactions) =>
          transactions.map((transaction) =>
            SplitwiseTransaction.fromDto(transaction)
          )
        )
      )
      .toPromise();
  }

  getSplitwiseUsers(): Promise<SplitwiseUser[]> {
    const url = `${SplitwiseService.BaseUrl}/users`;

    return this.http
      .get<ISplitwiseUser[]>(url)
      .pipe(map((users) => users.map((user) => SplitwiseUser.fromDto(user))))
      .toPromise();
  }

  completeTransactionImport(
    splitwiseId: number,
    categoryId: number
  ): Promise<Transaction> {
    const url = `${SplitwiseService.BaseUrl}/complete-import/${splitwiseId}`;

    return this.http
      .post<ITransaction>(url, { categoryId })
      .pipe(map((transaction) => Transaction.fromDto(transaction)))
      .toPromise();
  }

  importFromSplitwise(): Promise<ImportResult> {
    const url = `${SplitwiseService.BaseUrl}/import`;

    return this.http.post<ImportResult>(url).toPromise();
  }

  getImporterInformation(): Promise<ImporterInformation> {
    const url = `${SplitwiseService.BaseUrl}/importer-information`;

    return this.http
      .get<IImporterInformation>(url)
      .pipe(map((info) => ImporterInformation.fromDto(info)))
      .toPromise();
  }
}
