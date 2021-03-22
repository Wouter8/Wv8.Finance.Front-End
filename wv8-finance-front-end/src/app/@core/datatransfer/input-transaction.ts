import { Maybe, IMaybe } from "@wv8/typescript.core";
import {
  IInputBaseTransaction,
  InputBaseTransaction,
} from "./input-base-transaction";
import {
  IInputPaymentRequest,
  InputPaymentRequest,
} from "./input-payment-request";
import { InputSplitwiseSplit } from "./input-splitwise-split";

export interface IInputTransaction extends IInputBaseTransaction {
  dateString: string;
}

export class InputTransaction extends InputBaseTransaction {
  date: Date;

  constructor(
    accountId: number,
    description: string,
    date: Date,
    amount: number,
    categoryId: Maybe<number>,
    receivingAccountId: Maybe<number>,
    needsConfirmation: boolean,
    paymentRequests: InputPaymentRequest[],
    splitwiseSplits: InputSplitwiseSplit[]
  ) {
    super(
      accountId,
      description,
      amount,
      categoryId,
      receivingAccountId,
      needsConfirmation,
      paymentRequests,
      splitwiseSplits
    );
    this.date = date;
  }

  public serialize(): IInputTransaction {
    return {
      accountId: this.accountId,
      description: this.description,
      amount: this.amount,
      dateString: this.date.toDateString(),
      categoryId: this.categoryId.serialize(),
      receivingAccountId: this.receivingAccountId.serialize(),
      needsConfirmation: this.needsConfirmation,
      paymentRequests: this.paymentRequests.map((pr) => pr.serialize()),
      splitwiseSplits: this.splitwiseSplits.map((ss) => ss.serialize()),
    };
  }
}
