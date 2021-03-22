import { IMaybe, Maybe } from "@wv8/typescript.core";
import {
  IInputPaymentRequest,
  InputPaymentRequest,
} from "./input-payment-request";
import {
  IInputSplitwiseSplit,
  InputSplitwiseSplit,
} from "./input-splitwise-split";

export interface IInputBaseTransaction {
  accountId: number;
  description: string;
  amount: number;
  categoryId: IMaybe<number>;
  receivingAccountId: IMaybe<number>;
  needsConfirmation: boolean;
  paymentRequests: IInputPaymentRequest[];
  splitwiseSplits: IInputSplitwiseSplit[];
}

export class InputBaseTransaction {
  accountId: number;
  description: string;
  amount: number;
  categoryId: Maybe<number>;
  receivingAccountId: Maybe<number>;
  needsConfirmation: boolean;
  paymentRequests: InputPaymentRequest[];
  splitwiseSplits: InputSplitwiseSplit[];

  constructor(
    accountId: number,
    description: string,
    amount: number,
    categoryId: Maybe<number>,
    receivingAccountId: Maybe<number>,
    needsConfirmation: boolean,
    paymentRequests: InputPaymentRequest[],
    splitwiseSplits: InputSplitwiseSplit[]
  ) {
    this.accountId = accountId;
    this.description = description;
    this.amount = amount;
    this.categoryId = categoryId;
    this.receivingAccountId = receivingAccountId;
    this.needsConfirmation = needsConfirmation;
    this.paymentRequests = paymentRequests;
    this.splitwiseSplits = splitwiseSplits;
  }
}
