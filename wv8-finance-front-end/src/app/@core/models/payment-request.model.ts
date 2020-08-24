import { Transaction } from './transaction.model';
import { IPaymentRequest } from '../data/transaction';

export class PaymentRequest {
  id: number;
  transactionId: number;
  amount: number;
  name: string;
  count: number;
  paidCount: number;
  amountDue: number;
  complete: boolean;
  transaction: Transaction;

  public static fromDto(dto: IPaymentRequest): PaymentRequest {
    let instance = new PaymentRequest();

    instance.id = dto.id;
    instance.transactionId = dto.transactionId;
    instance.amount = dto.amount;
    instance.count = dto.count;
    instance.paidCount = dto.paidCount;
    instance.amountDue = dto.amountDue;
    instance.complete = dto.complete;
    instance.transaction = Transaction.fromDto(dto.transaction);

    return instance;
  }

  public copy(): PaymentRequest {
    let instance = new PaymentRequest();

    instance.id = this.id;
    instance.transactionId = this.transactionId;
    instance.amount = this.amount;
    instance.count = this.count;
    instance.paidCount = this.paidCount;
    instance.amountDue = this.amountDue;
    instance.complete = this.complete;
    instance.transaction = this.transaction.copy();

    return instance;
  }
}
