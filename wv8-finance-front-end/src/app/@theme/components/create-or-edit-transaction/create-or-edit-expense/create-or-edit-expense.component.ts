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
import {
  ISplitwiseUser,
  SplitSpecification,
} from "../../../../@core/models/split-specification.model";
import { SplitType } from "../../../../@core/enums/split-type.enum";
import { SplitCalculaterService } from "../../../../@core/services/split-calculater.service";

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

  splitwiseUsers: ISplitwiseUser[];

  constructor(private calculateService: SplitCalculaterService) {}

  ngOnInit() {
    this.hasSplits = this.transaction.splitDetails.length > 0;
    if (this.hasSplits) this.loadSplitwiseUsers();
  }

  dateChanged(date: Date) {
    this.transaction.date = new Date(date);
  }

  setCategoryId(id: number) {
    this.transaction.categoryId = new Maybe(id);
  }

  toggleSpecifyingSplits() {
    this.hasSplits = !this.hasSplits;

    if (!this.splitwiseUsers) this.loadSplitwiseUsers();

    this.calculateSplitAmounts();
  }

  loadSplitwiseUsers() {
    // TODO: Get users from backend
    this.splitwiseUsers = [
      { id: 1, name: "Brent" },
      { id: 2, name: "Stef" },
      { id: 3, name: "Stefan" },
    ];

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

    if (sumSplits !== this.transaction.amount)
      return ["The sum of the splits must be equal to the transaction amount."];

    return [];
  }
}
