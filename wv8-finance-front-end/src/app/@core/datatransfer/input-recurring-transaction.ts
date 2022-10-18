import { Maybe, IMaybe } from "@wv8/typescript.core";
import { IntervalUnit } from "../enums/interval-unit";
import { IInputBaseTransaction, InputBaseTransaction } from "./input-base-transaction";
import { IInputPaymentRequest, InputPaymentRequest } from "./input-payment-request";
import { InputSplitwiseSplit } from "./input-splitwise-split";

export interface IInputRecurringTransaction extends IInputBaseTransaction {
  startDateString: string;
  endDateString: IMaybe<string>;
  interval: number;
  intervalUnit: IntervalUnit;
}

export class InputRecurringTransaction extends InputBaseTransaction {
  startDate: Date;
  endDate: Maybe<Date>;
  interval: number;
  intervalUnit: IntervalUnit;

  constructor(
    accountId: number,
    description: string,
    startDate: Date,
    endDate: Maybe<Date>,
    amount: number,
    categoryId: Maybe<number>,
    receivingAccountId: Maybe<number>,
    needsConfirmation: boolean,
    interval: number,
    intervalUnit: IntervalUnit,
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
    this.startDate = startDate;
    this.endDate = endDate;
    this.interval = interval;
    this.intervalUnit = intervalUnit;
  }

  public serialize(): IInputRecurringTransaction {
    return {
      accountId: this.accountId,
      description: this.description,
      amount: this.amount,
      startDateString: this.startDate.toDateString(),
      endDateString: this.endDate.map((d) => d.toDateString()).serialize(),
      categoryId: this.categoryId.serialize(),
      receivingAccountId: this.receivingAccountId.serialize(),
      needsConfirmation: this.needsConfirmation,
      interval: this.interval,
      intervalUnit: this.intervalUnit,
      paymentRequests: this.paymentRequests.map((pr) => pr.serialize()),
      splitwiseSplits: this.splitwiseSplits.map((ss) => ss.serialize()),
    };
  }
}
