import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IAccount, AccountData } from "../data/account";
import { Account } from "../models/account.model";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { HttpService } from "../utils/http.service";

@Injectable()
export class AccountService extends AccountData {
  private static BaseUrl = `${environment.base_url}/accounts`;

  constructor(private http: HttpService) {
    super();
  }

  getAccount(id: number): Observable<Account> {
    const url = `${AccountService.BaseUrl}/${id}`;

    return this.http
      .get<IAccount>(url)
      .pipe(map(account => Account.fromDto(account)));
  }

  getAccounts(includeObsolete: boolean = false): Observable<Account[]> {
    const url = `${AccountService.BaseUrl}`;

    return this.http
      .get<IAccount[]>(url, { includeObsolete })
      .pipe(map(accounts => accounts.map(a => Account.fromDto(a))));
  }

  updateAccount(
    id: number,
    description: string,
    isDefault: boolean,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Observable<Account> {
    const url = `${AccountService.BaseUrl}/${id}`;

    return this.http
      .put<IAccount>(url, {
        description,
        isDefault,
        iconPack,
        iconName,
        iconColor
      })
      .pipe(map(account => Account.fromDto(account)));
  }

  createAccount(
    description: string,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Observable<Account> {
    const url = `${AccountService.BaseUrl}`;

    return this.http
      .post<IAccount>(url, {
        description,
        iconPack,
        iconName,
        iconColor
      })
      .pipe(map(account => Account.fromDto(account)));
  }

  setAccountObsolete(id: number, obsolete: boolean): Observable<void> {
    const url = `${AccountService.BaseUrl}/obsolete/${id}`;

    return this.http.put<void>(url, {
      obsolete
    });
  }
}
