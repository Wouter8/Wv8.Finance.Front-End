import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Transaction } from "../../../../@core/models/transaction.model";
import { Maybe } from "@wv8/typescript.core";
import { SplitSpecification } from "../../../../@core/models/split-specification.model";
import { SplitType } from "../../../../@core/enums/split-type.enum";
import { SplitCalculaterService } from "../../../../@core/services/split-calculater.service";
import { ISplitwiseData } from "../../../../@core/data/splitwise";
import { SplitwiseUser } from "../../../../@core/models/splitwise-user.model";

@Component({
  selector: "create-or-edit-expense",
  templateUrl: "./create-or-edit-expense.component.html",
  styleUrls: ["./create-or-edit-expense.component.scss"],
})
export class CreateOrEditExpenseComponent implements OnInit {
  @Input() transaction: Transaction;
  @Input() editing: boolean;

  hasSplits: boolean = false;
  splitType: SplitType = SplitType.Equal;
  splitTypes = SplitType;
  splits: SplitSpecification[];

  splitwiseUsers: SplitwiseUser[];

  constructor(
    private splitwiseService: ISplitwiseData,
    private calculateService: SplitCalculaterService
  ) { }

  async ngOnInit() {
    this.hasSplits = this.transaction.splitDetails.length > 0;

    if (this.hasSplits) {
      await this.loadSplitwiseUsers();
      this.splits = this.calculateService.toSpecifications(
        this.transaction.personalAmount,
        this.transaction.splitDetails,
        this.splitwiseUsers
      );

      this.splitType = this.calculateService.getSplitType(
        this.transaction.amount,
        this.transaction.personalAmount,
        this.splits.map((s) => s.amount)
      );
    }
  }

  dateChanged(date: Date) {
    this.transaction.date = new Date(date);
  }

  setCategoryId(id: number) {
    this.transaction.categoryId = new Maybe(id);
  }

  async toggleSpecifyingSplits() {
    this.hasSplits = !this.hasSplits;

    if (!this.splitwiseUsers) await this.loadSplitwiseUsers();

    this.calculateSplitAmounts();
  }

  async loadSplitwiseUsers() {
    this.splitwiseUsers = await this.splitwiseService.getSplitwiseUsers();

    let me = new SplitSpecification(Maybe.none(), 0);
    this.splits = this.splitwiseUsers.map(
      (u) => new SplitSpecification(Maybe.some(u), 0)
    );
    this.splits.unshift(me);
  }

  addToStake(split: SplitSpecification, change: number) {
    split.stake += change;
    this.calculateSplitAmounts();
  }

  addToStakeIfZero(split: SplitSpecification) {
    if (split.stake === 0) this.addToStake(split, 1);
  }

  onSplitTypeChanged() {
    this.calculateSplitAmounts();

    if (this.splitType == SplitType.Exact) {
      for (let i = 0; i < this.splits.length; i++) {
        this.splits[i].amount =
          this.splits[i].amount === 0 ? undefined : this.splits[i].amount;
      }
    }
  }

  calculateSplitAmounts() {
    if (this.hasSplits) {
      this.calculateService.calculateSplits(
        this.splits,
        this.transaction.amount,
        this.splitType
      );
    }
  }

  public validate(): string[] {
    if (!this.hasSplits) return [];

    this.calculateSplitAmounts();

    var sumSplits = 0;
    for (let i = 0; i < this.splits.length; i++) {
      sumSplits += !this.splits[i].amount ? 0 : this.splits[i].amount;
    }

    sumSplits = Math.round(sumSplits * 100) / 100;

    if (sumSplits !== this.transaction.amount)
      return ["The sum of the splits must be equal to the transaction amount."];

    return [];
  }
}
