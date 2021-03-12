import { Injectable } from "@angular/core";
import { SplitType } from "../enums/split-type.enum";
import { SplitSpecification } from "../models/split-specification.model";
import { Money, Currencies } from "ts-money";
import { SplitDetail } from "../models/split-detail.model";
import { SplitwiseUser } from "../models/splitwise-user.model";
import { Maybe } from "@wv8/typescript.core";

@Injectable({
  providedIn: "root",
})
export class SplitCalculaterService {
  constructor() {}

  public calculateSplits(
    splits: SplitSpecification[],
    amount: number,
    splitType: SplitType
  ) {
    if (!amount) amount = 0;

    amount = Math.round(amount * 100);
    let amountMoney = new Money(amount, Currencies.EUR);
    switch (splitType) {
      case SplitType.Exact:
        // When split type is exact, the splits already contain the correct amount.
        break;

      case SplitType.Equal:
        let usersInSplit = splits
          .filter((s) => s.hasSplit)
          .map((s) => s.getUserId());
        let amountsEqual =
          usersInSplit.length === 0
            ? [new Money(0, Currencies.EUR)]
            : // Share equally.
              amountMoney.allocate(usersInSplit.map((_) => 1));

        // Reverse the applying because the allocation returns the highest splits first.
        let equalAmountIndex = amountsEqual.length - 1;
        for (let i = 0; i < splits.length; i++) {
          if (usersInSplit.indexOf(splits[i].getUserId()) >= 0) {
            splits[i].amount = amountsEqual[equalAmountIndex].amount / 100;
            equalAmountIndex--;
          } else {
            splits[i].amount = 0;
          }
        }
        break;
      case SplitType.Stakes:
        let splitsWithStake = splits.filter((s) => s.stake > 0).reverse();
        if (splitsWithStake.length === 0) {
          for (let i = 0; i < splits.length; i++) {
            splits[i].amount = 0;
          }
          break;
        }

        let amountsStakes = amountMoney.allocate(
          splitsWithStake.map((s) => s.stake)
        );

        let stakesAmountIndex = 0;
        for (var i = splits.length - 1; i >= 0; i--) {
          if (splits[i].stake > 0) {
            splits[i].amount = amountsStakes[stakesAmountIndex].amount / 100;
            stakesAmountIndex++;
          } else {
            splits[i].amount = 0;
          }
        }
        break;
      default:
        throw "Unknown split type";
    }
  }

  public toSpecifications(
    amount: number,
    personalAmount: number,
    details: SplitDetail[],
    users: SplitwiseUser[]
  ): SplitSpecification[] {
    var money = new Money(amount, Currencies.EUR);
    var specifications = [new SplitSpecification(Maybe.none(), personalAmount)];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      var detail = new Maybe(
        details.find((d) => d.splitwiseUserId === user.id)
      );

      specifications.push(
        new SplitSpecification(
          Maybe.some(user),
          detail.map((d) => d.amount).valueOrElse(0)
        )
      );
    }

    return specifications;
  }

  public getSplitType(
    amount: number,
    personalAmount: number,
    splits: number[]
  ): SplitType {
    let money = new Money(Math.round(amount * 100), Currencies.EUR);
    let moneys = splits
      .filter((s) => s > 0)
      .map((s) => new Money(Math.round(s * 100), Currencies.EUR));
    let personalMoney = new Money(
      Math.round(personalAmount * 100),
      Currencies.EUR
    );

    if (this.isEqualShare(money, moneys)) return SplitType.Equal;
    if (this.isStakesShare(money, personalMoney, moneys))
      return SplitType.Stakes;

    return SplitType.Exact;
  }

  private isEqualShare(amount: Money, splits: Money[]): boolean {
    var allocation = splits.map((_) => 1);
    var shares = amount.allocate(allocation);

    return this.containSameValues(splits, shares);
  }

  private isStakesShare(
    amount: Money,
    personalAmount: Money,
    splits: Money[]
  ): boolean {
    // TODO.
    return false;
  }

  private containSameValues(a: Money[], b: Money[]): boolean {
    let aString = a
      .map((m) => m.amount / 100)
      .sort()
      .join(",");
    let bString = b
      .map((m) => m.amount / 100)
      .sort()
      .join(",");

    return aString === bString;
  }
}
