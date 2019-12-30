import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IAccount, AccountData } from "../data/account";
import { Account } from "../models/account.model";
import { map } from "rxjs/operators";

@Injectable()
export class AccountService extends AccountData {
  private accounts: IAccount[] = [
    {
      id: 1,
      name: "Betaalrekening",
      startBalance: 350.13,
      default: true,
      obsolete: false,
      icon: "credit-card",
      iconPack: "fas",
      color: '#ba1307',
    },
    {
      id: 2,
      name: "Credit card",
      startBalance: 1800,
      default: false,
      obsolete: false,
      icon: "landmark",
      iconPack: "fas",
      color: '#7207b5',
    }
  ];
  
  getAccount(id: number): Observable<Account> {
    let account = this.accounts.filter(a => a.id == id)[0];

    if (!account) throw new Error("Account not found");

    return observableOf(account).pipe(map(a => Account.fromDto(a)));
  }

  getAccounts(): Observable<Account[]> {
    return observableOf(this.accounts).pipe(
      map(accounts => accounts.map(a => Account.fromDto(a)))
    );
  }

  updateAccount(account: IAccount): Observable<Account> {
    let index = this.accounts.indexOf(
      this.accounts.find(a => a.id === account.id)
    );

    if (account.default)
      this.accounts = this.accounts.map(a => {
        a.default = false;
        return a;
      });

    this.accounts[index] = account;

    return observableOf(this.accounts[index]).pipe(
      map(a => Account.fromDto(a))
    );
  }

  createAccount(account: IAccount): Observable<Account> {
    if (account.default)
      this.accounts = this.accounts.map(a => {
        a.default = false;
        return a;
      });

    account.id = this.accounts[this.accounts.length - 1].id + 1;

    this.accounts.push(account);

    return observableOf(this.accounts[this.accounts.length - 1]).pipe(
      map(a => Account.fromDto(a))
    );
  }


  setAccountObsolete(id: number, obsolete: boolean): Observable<Account> {
    let account = this.accounts.find(a => a.id === id);
    let index = this.accounts.indexOf(account);
    
    account.default = false;
    account.obsolete = obsolete;

    this.accounts[index] = account;

    return observableOf(this.accounts[index]).pipe(
      map(a => Account.fromDto(a))
    );
  }
}
