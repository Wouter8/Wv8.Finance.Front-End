import { Observable } from "rxjs";
import { Account } from "../models/account.model";
import { IIcon } from "./icon";

export interface IAccount {
  id: number;
  description: string;
  isObsolete: boolean;
  currentBalance: number;
  isDefault: boolean;
  icon: IIcon;
}

export abstract class AccountData {
  abstract getAccount(id: number): Promise<Account>;
  abstract getAccounts(includeObsolete: boolean): Promise<Account[]>;
  abstract updateAccount(
    id: number,
    description: string,
    isDefault: boolean,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Promise<Account>;
  abstract createAccount(
    description: string,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Promise<Account>;
  abstract setAccountObsolete(id: number, obsolete: boolean): Promise<void>;
}
