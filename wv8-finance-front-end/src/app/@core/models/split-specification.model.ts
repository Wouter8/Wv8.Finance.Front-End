import { Maybe } from "@wv8/typescript.core";
import { InputSplitwiseSplit } from "../datatransfer/input-splitwise-split";
import { SplitDetail } from "./split-detail.model";
import { SplitwiseUser } from "./splitwise-user.model";

export class SplitSpecification {
  userId: number;
  hasSplit: boolean;
  stake: number;
  amount: number;
  name: string;

  constructor(userId: number, name: string, amount: number, stake: number = 0) {
    this.userId = userId;
    this.hasSplit = amount > 0;
    this.stake = stake;
    this.amount = amount;
    this.name = name;
  }

  public asInput(): InputSplitwiseSplit {
    return new InputSplitwiseSplit(this.userId, this.amount);
  }

  public copy(): SplitSpecification {
    return new SplitSpecification(
      this.userId,
      this.name,
      this.amount,
      this.stake
    );
  }
}
