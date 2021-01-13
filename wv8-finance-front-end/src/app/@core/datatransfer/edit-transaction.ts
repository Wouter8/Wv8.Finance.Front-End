import { Maybe, IMaybe } from '@wv8/typescript.core';
import { IInputPaymentRequest, InputPaymentRequest } from './input-payment-request';
import { IInputTransaction, InputTransaction } from './input-transaction';

export interface IEditTransaction extends IInputTransaction {
  id: number;
}

export class EditTransaction extends InputTransaction {
  id: number;

  constructor(id: number, accountId: number, description: string, date: Date, amount: number, categoryId: Maybe<number>, receivingAccountId: Maybe<number>, needsConfirmation: boolean, paymentRequests: InputPaymentRequest[]) {
    super(accountId, description, date, amount, categoryId, receivingAccountId, needsConfirmation, paymentRequests);
    this.id = id;
  }

  public serialize(): IEditTransaction {
    return {
      id: this.id,
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
