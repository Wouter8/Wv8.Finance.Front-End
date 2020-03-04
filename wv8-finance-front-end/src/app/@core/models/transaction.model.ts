import { ITransaction } from "../data/transaction";
import { TransactionType } from "../enums/transaction-type.enum";
import { Category } from "./category.model";
import { Maybe } from "@wv8/typescript.core";
import { Account } from "./account.model";

export class Transaction {
  id: number;
  description: string;
  date: Date;
  type: TransactionType;
  amount: number;
  categoryId: Maybe<number> = Maybe.none();
  category: Maybe<Category> = Maybe.none();
  accountId: number;
  account: Account;
  receivingAccountId: Maybe<number> = Maybe.none();
  receivingAccount: Maybe<Account> = Maybe.none();
  processed: boolean;
  recurringTransactionId: Maybe<number> = Maybe.none();

  public static fromDto(dto: ITransaction): Transaction {
    let instance = new Transaction();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.date = new Date(dto.date);
    instance.type = dto.type;
    instance.amount =
      dto.type == TransactionType.Expense ? -dto.amount : dto.amount;
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
    instance.processed = dto.processed;
    instance.recurringTransactionId = Maybe.deserialize(
      dto.recurringTransactionId
    );

    return instance;
  }

  public copy(): Transaction {
    let instance = new Transaction();

    instance.id = this.id;
    instance.description = this.description;
    instance.date = new Date(this.date);
    instance.type = this.type;
    instance.amount = this.amount;
    instance.categoryId = new Maybe(this.categoryId.valueOrElse(undefined));
    instance.category = this.category.map(c => c.copy());
    instance.accountId = this.accountId;
    instance.account = this.account.copy();
    instance.receivingAccountId = new Maybe(
      this.receivingAccountId.valueOrElse(undefined)
    );
    instance.receivingAccount = this.receivingAccount.map(a => a.copy());
    instance.processed = this.processed;
    instance.recurringTransactionId = new Maybe(
      this.recurringTransactionId.valueOrElse(undefined)
    );

    return instance;
  }
}
