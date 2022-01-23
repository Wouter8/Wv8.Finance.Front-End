import { Maybe, IMaybe } from '@wv8/typescript.core';

export interface IInputPaymentRequest {
  id: IMaybe<number>;
  amount: number;
  name: string;
  count: number;
}

export class InputPaymentRequest {
  id: Maybe<number>;
  amount: number;
  name: string;
  count: number;

  public serialize(): IInputPaymentRequest {
    return {
      id: this.id.serialize(),
      amount: this.amount,
      name: this.name,
      count: this.count,
    }
  }

  public static initCreate(amount: number, name: string, count: number): InputPaymentRequest {
    let input = new InputPaymentRequest();

    input.id = Maybe.none();
    input.amount = amount;
    input.name = name;
    input.count = count;

    return input;
  }

  public static initEdit(id: number, amount: number, name: string, count: number): InputPaymentRequest {
    let input = new InputPaymentRequest();

    input.id = Maybe.some(id);
    input.amount = amount;
    input.name = name;
    input.count = count;

    return input;
  }
}
