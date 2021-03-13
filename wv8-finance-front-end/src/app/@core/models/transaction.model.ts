import { ITransaction } from "../data/transaction";
import { TransactionType } from "../enums/transaction-type.enum";
import { Category } from "./category.model";
import { Maybe } from "@wv8/typescript.core";
import { Account } from "./account.model";
import { PaymentRequest } from "./payment-request.model";
import { RecurringTransaction } from "./recurring-transaction.model";
import { BaseTransaction } from "./base-transaction.model";
import { SplitDetail } from "./split-detail.model";

export class Transaction extends BaseTransaction {
  date: Date;
  processed: boolean;
  recurringTransactionId: Maybe<number> = Maybe.none();
  recurringTransaction: Maybe<RecurringTransaction> = Maybe.none();
  isConfirmed: Maybe<boolean> = Maybe.none();
  editable: boolean = true;

  public static fromDto(dto: ITransaction): Transaction {
    let instance = new Transaction();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.date = new Date(dto.date);
    instance.type = dto.type;
    instance.amount = Math.abs(dto.amount);
    instance.personalAmount = Math.abs(dto.personalAmount);
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
    instance.paymentRequests = dto.paymentRequests.map((pr) =>
      PaymentRequest.fromDto(pr)
    );
    instance.splitDetails = dto.splitDetails.map((sd) =>
      SplitDetail.fromDto(sd)
    );
    instance.editable = dto.editable;

    return instance;
  }

  public copy(): Transaction {
    let instance = new Transaction();

    instance.id = this.id;
    instance.description = this.description;
    instance.date = new Date(this.date);
    instance.type = this.type;
    instance.amount = this.amount;
    instance.personalAmount = this.personalAmount;
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
    instance.paymentRequests = this.paymentRequests.map((pr) => pr.copy());
    instance.splitDetails = this.splitDetails.map((sd) => sd.copy());
    instance.editable = this.editable;

    return instance;
  }
}
