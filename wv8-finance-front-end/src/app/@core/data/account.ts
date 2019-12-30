import { Observable } from 'rxjs';
import { Account } from '../models/account.model';

export interface IAccount {
  id: number;
  name: string;
  obsolete: boolean;
  startBalance: number;
  default: boolean;
  icon: string;
  iconPack: string;
  color: string;
}

export abstract class AccountData {
  abstract getAccount(id: number): Observable<Account>;
  abstract getAccounts(): Observable<Account[]>;
  abstract updateAccount(account: IAccount): Observable<Account>;
  abstract createAccount(account: IAccount): Observable<Account>;
  abstract setAccountObsolete(id: number, obsolete: boolean): Observable<Account>;
}
