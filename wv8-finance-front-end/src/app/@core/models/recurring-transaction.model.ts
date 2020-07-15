import { ITransaction } from "../data/transaction";
import { TransactionType } from "../enums/transaction-type.enum";
import { Category } from "./category.model";
import { Maybe } from "@wv8/typescript.core";
import { Account } from "./account.model";
import { IRecurringTransaction } from "../data/recurring-transaction";
import { IntervalUnit } from "../enums/interval-unit";

export class RecurringTransaction {
  id: number;
  description: string;
  startDate: Date;
  endDate: Maybe<Date>;
  type: TransactionType;
  amount: number;
  categoryId: Maybe<number> = Maybe.none();
  category: Maybe<Category> = Maybe.none();
  accountId: number;
  account: Account;
  receivingAccountId: Maybe<number> = Maybe.none();
  receivingAccount: Maybe<Account> = Maybe.none();
  nextOccurence: Maybe<Date> = Maybe.none();
  finished: boolean;
  intervalUnit: IntervalUnit;
  interval: number;
  needsConfirmation: boolean;

  public static fromDto(dto: IRecurringTransaction): RecurringTransaction {
    let instance = new RecurringTransaction();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.startDate = new Date(dto.startDate);
    instance.endDate = Maybe.deserialize(dto.endDate).map(d => new Date(d));
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
    instance.nextOccurence = Maybe.deserialize(dto.nextOccurence).map(
      d => new Date(d)
    );
    instance.finished = dto.finished;
    instance.interval = dto.interval;
    instance.intervalUnit = dto.intervalUnit;
    instance.needsConfirmation = dto.needsConfirmation;

    return instance;
  }

  public copy(): RecurringTransaction {
    let instance = new RecurringTransaction();

    instance.id = this.id;
    instance.description = this.description;
    instance.startDate = new Date(this.startDate);
    instance.endDate = this.endDate.map(d => new Date(d));
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
    instance.nextOccurence = this.nextOccurence.map(d => new Date(d));
    instance.finished = this.finished;
    instance.interval = this.interval;
    instance.intervalUnit = this.intervalUnit;
    instance.needsConfirmation = this.needsConfirmation;

    return instance;
  }
}
