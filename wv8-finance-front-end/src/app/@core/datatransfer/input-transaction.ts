import { Maybe, IMaybe } from '@wv8/typescript.core';
import { IInputPaymentRequest, InputPaymentRequest } from './input-payment-request';

export interface IInputTransaction {
  accountId: number;
  description: string;
  dateString: string;
  amount: number;
  categoryId: IMaybe<number>;
  receivingAccountId: IMaybe<number>;
  needsConfirmation: boolean;
  paymentRequests: IInputPaymentRequest[];
}

export class InputTransaction {
  accountId: number;
  description: string;
  date: Date;
  amount: number;
  categoryId: Maybe<number>;
  receivingAccountId: Maybe<number>;
  needsConfirmation: boolean;
  paymentRequests: InputPaymentRequest[];

  constructor(accountId: number, description: string, date: Date, amount: number, categoryId: Maybe<number>, receivingAccountId: Maybe<number>, needsConfirmation: boolean, paymentRequests: InputPaymentRequest[]) {
    this.accountId = accountId;
    this.description = description;
    this.date = date;
    this.amount = amount;
    this.categoryId = categoryId;
    this.receivingAccountId = receivingAccountId;
    this.needsConfirmation = needsConfirmation;
    this.paymentRequests = paymentRequests;
  }

  public serialize(): IInputTransaction {
    return {
      accountId: this.accountId,
      description: this.description,
      dateString: this.date.toDateString(),
      amount: this.amount,
      categoryId: this.categoryId.serialize(),
      receivingAccountId: this.receivingAccountId.serialize(),
      needsConfirmation: this.needsConfirmation,
      paymentRequests: this.paymentRequests.map(pr => pr.serialize()),
    };
  }
}
