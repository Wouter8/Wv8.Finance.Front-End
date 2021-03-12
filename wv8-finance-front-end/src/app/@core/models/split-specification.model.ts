import { Maybe } from "@wv8/typescript.core";

export interface ISplitwiseUser {
  id: number;
  name: string;
}

export class SplitSpecification {
  user: Maybe<ISplitwiseUser>;
  hasSplit: boolean;
  stake: number;
  amount: number;
  name: string;

  constructor(user: Maybe<ISplitwiseUser>, amount: number, stake: number = 0) {
    this.user = user;
    this.hasSplit = false;
    this.stake = stake;
    this.amount = 0;
    this.name = this.user.map((u) => u.name).valueOrElse("Me");
  }

  public getUserId(): number {
    return this.user.map((u) => u.id).valueOrElse(-1);
  }
}
