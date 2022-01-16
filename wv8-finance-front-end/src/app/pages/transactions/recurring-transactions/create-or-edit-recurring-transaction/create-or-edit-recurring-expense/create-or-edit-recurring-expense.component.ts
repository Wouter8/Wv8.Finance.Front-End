import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { Maybe } from "@wv8/typescript.core";
import { NbDatepicker, NbDateService, NbCalendarRange } from "@nebular/theme";
import { RecurringTransaction } from "../../../../../@core/models/recurring-transaction.model";
import { IntervalUnit } from "../../../../../@core/enums/interval-unit";
import { SplitType } from "../../../../../@core/enums/split-type.enum";
import { SplitSpecification } from "../../../../../@core/models/split-specification.model";
import { SplitCalculaterService } from "../../../../../@core/services/split-calculater.service";
import { SplitwiseUser } from "../../../../../@core/models/splitwise-user.model";
import { ISplitwiseData } from "../../../../../@core/data/splitwise";

@Component({
  selector: "create-or-edit-recurring-expense",
  templateUrl: "./create-or-edit-recurring-expense.component.html",
  styleUrls: ["./create-or-edit-recurring-expense.component.scss"],
})
export class CreateOrEditRecurringExpenseComponent implements OnInit {
  @Input() recurringTransaction: RecurringTransaction;
  @Input() editing: boolean;

  @Input() updateInstances: boolean;
  @Output() updateInstancesChange = new EventEmitter<boolean>();

  hasSplits: boolean = false;
  splitType: SplitType = SplitType.Equal;
  splitTypes = SplitType;
  splits: SplitSpecification[];

  splitwiseUsers: SplitwiseUser[];

  intervalUnits = IntervalUnit;

  constructor(
    private splitwiseService: ISplitwiseData,
    private calculateService: SplitCalculaterService
  ) { }

  async ngOnInit() {
    this.hasSplits = this.recurringTransaction.splitDetails.length > 0;

    if (this.hasSplits) {
      await this.loadSplitwiseUsers();
      this.splits = this.calculateService.toSpecifications(
        this.recurringTransaction.personalAmount,
        this.recurringTransaction.splitDetails,
        this.splitwiseUsers
      );

      this.splitType = this.calculateService.getSplitType(
        this.recurringTransaction.amount,
        this.recurringTransaction.personalAmount,
        this.splits.map((s) => s.amount)
      );
    }
  }

  periodChanged(period: NbCalendarRange<Date>) {
    this.recurringTransaction.startDate = new Date(period.start);
    this.recurringTransaction.endDate = new Maybe(period.end).map(
      (s) => new Date(s)
    );
  }

  setCategoryId(id: number) {
    this.recurringTransaction.categoryId = new Maybe(id);
  }

  onUpdateInstanceChange(val: boolean) {
    this.updateInstancesChange.emit(val);
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
        this.recurringTransaction.amount,
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

    if (sumSplits !== this.recurringTransaction.amount)
      return ["The sum of the splits must be equal to the transaction amount."];

    return [];
  }
}
