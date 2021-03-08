import { ITransaction } from "../data/transaction";
import { TransactionType } from "../enums/transaction-type.enum";
import { Category } from "./category.model";
import { Maybe } from "@wv8/typescript.core";
import { Account } from "./account.model";
import { IRecurringTransaction } from "../data/recurring-transaction";
import { IntervalUnit } from "../enums/interval-unit";
import { PaymentRequest } from "./payment-request.model";
import { SplitDetail } from "./split-detail.model";
import { BaseTransaction } from "./base-transaction.model";

export class RecurringTransaction extends BaseTransaction {
  startDate: Date;
  endDate: Maybe<Date>;
  nextOccurence: Maybe<Date> = Maybe.none();
  finished: boolean;
  intervalUnit: IntervalUnit;
  interval: number;

  public static fromDto(dto: IRecurringTransaction): RecurringTransaction {
    let instance = new RecurringTransaction();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.startDate = new Date(dto.startDate);
    instance.endDate = Maybe.deserialize(dto.endDate).map((d) => new Date(d));
    instance.type = dto.type;
    instance.amount = Math.abs(dto.amount);
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
    instance.nextOccurence = Maybe.deserialize(dto.nextOccurence).map(
      (d) => new Date(d)
    );
    instance.finished = dto.finished;
    instance.interval = dto.interval;
    instance.intervalUnit = dto.intervalUnit;
    instance.needsConfirmation = dto.needsConfirmation;
    instance.paymentRequests = dto.paymentRequests.map((pr) =>
      PaymentRequest.fromDto(pr)
    );
    instance.splitDetails = dto.splitDetails.map((sd) =>
      SplitDetail.fromDto(sd)
    );

    return instance;
  }

  public copy(): RecurringTransaction {
    let instance = new RecurringTransaction();

    instance.id = this.id;
    instance.description = this.description;
    instance.startDate = new Date(this.startDate);
    instance.endDate = this.endDate.map((d) => new Date(d));
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
    instance.nextOccurence = this.nextOccurence.map((d) => new Date(d));
    instance.finished = this.finished;
    instance.interval = this.interval;
    instance.intervalUnit = this.intervalUnit;
    instance.needsConfirmation = this.needsConfirmation;
    instance.paymentRequests = this.paymentRequests.map((pr) => pr.copy());
    instance.splitDetails = this.splitDetails.map((sd) => sd.copy());

    return instance;
  }
}
