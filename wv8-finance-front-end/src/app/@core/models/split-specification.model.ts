import { Maybe } from "@wv8/typescript.core";
import { InputSplitwiseSplit } from "../datatransfer/input-splitwise-split";
import { SplitDetail } from "./split-detail.model";
import { SplitwiseUser } from "./splitwise-user.model";

export class SplitSpecification {
  user: Maybe<SplitwiseUser>;
  hasSplit: boolean;
  stake: number;
  amount: number;
  name: string;

  constructor(user: Maybe<SplitwiseUser>, amount: number, stake: number = 0) {
    this.user = user;
    this.hasSplit = amount > 0;
    this.stake = stake;
    this.amount = amount;
    this.name = this.user.map((u) => u.name).valueOrElse("Me");
  }

  public getUserId(): number {
    return this.user.map((u) => u.id).valueOrElse(-1);
  }

  public asInput(): InputSplitwiseSplit {
    if (this.user.isNone) throw "Can only create an input for another user.";
    return new InputSplitwiseSplit(this.user.value.id, this.amount);
  }

  public copy(): SplitSpecification {
    return new SplitSpecification(this.user, this.amount, this.stake);
  }
}
