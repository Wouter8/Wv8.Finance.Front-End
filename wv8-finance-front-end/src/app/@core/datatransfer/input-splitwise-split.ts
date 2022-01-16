
export interface IInputSplitwiseSplit {
  userId: number;
  amount: number;
}

export class InputSplitwiseSplit {
  userId: number;
  amount: number;

  constructor(userId: number, amount: number) {
    this.userId = userId;
    this.amount = amount;
  }

  public serialize(): IInputSplitwiseSplit {
    return {
      userId: this.userId,
      amount: this.amount,
    };
  }
}
