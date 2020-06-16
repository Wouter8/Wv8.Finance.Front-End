import { ITransaction } from "../data/transaction";
import { TransactionType } from "../enums/transaction-type.enum";
import { Category } from "./category.model";
import { Maybe } from "@wv8/typescript.core";
import { Account } from "./account.model";
import { RecurringTransaction } from "./recurring-transaction.model";
import { TransactionFlowType } from '../enums/transaction-flow-type.enum';

export class Transaction {
  id: number;
  description: string;
  date: Date;
  type: TransactionType;
  flowType: TransactionFlowType;
  amount: number;
  categoryId: Maybe<number> = Maybe.none();
  category: Maybe<Category> = Maybe.none();
  accountId: number;
  account: Account;
  receivingAccountId: Maybe<number> = Maybe.none();
  receivingAccount: Maybe<Account> = Maybe.none();
  processed: boolean;
  recurringTransactionId: Maybe<number> = Maybe.none();
  recurringTransaction: Maybe<RecurringTransaction> = Maybe.none();
  needsConfirmation: boolean = false;
  isConfirmed: Maybe<boolean> = Maybe.none();

  public static fromDto(dto: ITransaction): Transaction {
    let instance = new Transaction();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.date = new Date(dto.date);
    instance.type = dto.type;
    instance.flowType = dto.type == TransactionType.Internal
      ? TransactionFlowType.Transfer
      : dto.amount > 0
        ? TransactionFlowType.Income
        : TransactionFlowType.Expense;
    instance.amount = dto.amount;
    instance.categoryId = Maybe.deserialize(dto.categoryId);
    instance.category = Maybe.deserialize(dto.category).map((c) =>
      Category.fromDto(c)
    );
    instance.accountId = dto.accountId;
    instance.account = Account.fromDto(dto.account);
    instance.receivingAccountId = Maybe.deserialize(dto.receivingAccountId);
    instance.receivingAccount = Maybe.deserialize(
      dto.receivingAccount
    ).map((a) => Account.fromDto(a));
    instance.processed = dto.processed;
    instance.recurringTransactionId = Maybe.deserialize(
      dto.recurringTransactionId
    );
    instance.needsConfirmation = dto.needsConfirmation;
    instance.isConfirmed = Maybe.deserialize(dto.isConfirmed);
    instance.recurringTransaction = Maybe.deserialize(
      dto.recurringTransaction
    ).map((rt) => RecurringTransaction.fromDto(rt));

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
    instance.category = this.category.map((c) => c.copy());
    instance.accountId = this.accountId;
    instance.account = this.account.copy();
    instance.receivingAccountId = new Maybe(
      this.receivingAccountId.valueOrElse(undefined)
    );
    instance.receivingAccount = this.receivingAccount.map((a) => a.copy());
    instance.processed = this.processed;
    instance.recurringTransactionId = new Maybe(
      this.recurringTransactionId.valueOrElse(undefined)
    );
    instance.recurringTransaction = this.recurringTransaction.map((rt) =>
      rt.copy()
    );
    instance.needsConfirmation = this.needsConfirmation;
    instance.isConfirmed = new Maybe(this.isConfirmed.valueOrElse(undefined));

    return instance;
  }
}
