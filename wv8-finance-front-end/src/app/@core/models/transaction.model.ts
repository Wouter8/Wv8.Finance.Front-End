import { ITransaction } from "../data/transaction";
import { TransactionType } from "../enums/transaction-type.enum";
import { Category } from "./category.model";
import { Maybe } from "wv8.typescript.core";
import { Account } from "./account.model";

export class Transaction {
  id: number;
  description: string;
  date: Date;
  type: TransactionType;
  amount: number;
  categoryId: Maybe<number>;
  category: Maybe<Category>;
  accountId: number;
  account: Account;
  receivingAccountId: Maybe<number>;
  receivingAccount: Maybe<Account>;
  settled: boolean;
  recurringTransactionId: Maybe<number>;

  public static fromDto(dto: ITransaction): Transaction {
    let instance = new Transaction();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.date = new Date(dto.date);
    instance.type = dto.type;
    instance.amount = dto.amount;
    instance.categoryId = Maybe.deserialize(dto.categoryId);
    instance.category = Maybe.deserialize(dto.category).map(c =>
      Category.fromDto(c)
    );
    instance.accountId = dto.accountId;
    instance.account = Account.fromDto(dto.account);
    instance.receivingAccountId = Maybe.deserialize(dto.receivingAccountId);
    instance.receivingAccount = Maybe.deserialize(dto.receivingAccount).map(a =>
      Account.fromDto(a)
    );
    instance.settled = dto.settled;
    instance.recurringTransactionId = Maybe.deserialize(
      dto.recurringTransactionId
    );

    return instance;
  }

  public copy(): Transaction {
    let instance = new Transaction();

    instance.id = this.id;
    instance.description = this.description;
    instance.date = new Date(this.date.toISOString());
    instance.type = this.type;
    instance.amount = this.amount;
    instance.categoryId = Maybe.deserialize(this.categoryId.serialize());
    instance.category = this.category.map(c => c.copy());
    instance.accountId = this.accountId;
    instance.account = this.account.copy();
    instance.receivingAccountId = Maybe.deserialize(this.receivingAccountId);
    instance.receivingAccount = this.receivingAccount.map(a => a.copy());
    instance.settled = this.settled;
    instance.recurringTransactionId = Maybe.deserialize(
      this.recurringTransactionId.serialize()
    );

    return instance;
  }
}