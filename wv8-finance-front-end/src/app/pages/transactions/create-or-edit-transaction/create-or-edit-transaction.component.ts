import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import {
  NbStepperComponent,
  NbRangepickerComponent,
  NbDialogRef,
  NbToastrService,
  NbDateService,
  NbCalendarRange
} from "@nebular/theme";
import { Budget } from "../../../@core/models/budget.model";
import { OverlappingType } from "../../../@core/enums/overlapping-type";
import { CreateOrEditBudgetComponent } from "../../budgets/create-or-edit-budget/create-or-edit-budget.component";
import { BudgetData } from "../../../@core/data/budget";

@Component({
  selector: "create-or-edit-transaction",
  templateUrl: "./create-or-edit-transaction.component.html",
  styleUrls: ["./create-or-edit-transaction.component.scss"]
})
export class CreateOrEditTransactionComponent implements OnInit {
  @ViewChild("stepper", { static: true })
  stepper: NbStepperComponent;

  @ViewChild("periodPicker", { static: true })
  periodPicker: NbRangepickerComponent<Date>;

  @ViewChild("periodPickerInput", { static: true })
  periodPickerInput: ElementRef<HTMLInputElement>;

  @Input()
  budget: Budget;

  editing = false;
  header: string = "Creating new budget";

  OverlappingType = OverlappingType;

  constructor(
    protected dialogRef: NbDialogRef<CreateOrEditBudgetComponent>,
    private budgetService: BudgetData,
    private toasterService: NbToastrService,
    private dateService: NbDateService<Date>
  ) {}

  ngOnInit() {
    if (this.budget) {
      this.editing = true;
      this.budget = this.budget.copy();
      this.header = `Editing budget`;
      let range: NbCalendarRange<Date> = {
        start: this.dateService.getMonthStart(this.budget.startDate),
        end: this.dateService.getMonthEnd(this.budget.endDate)
      };
      this.periodPicker.range = range;
      this.periodPickerInput.nativeElement.value = `${this.dateService.format(
        range.start,
        "d MMM yy"
      )} - ${this.dateService.format(range.end, "d MMM yy")}`;
    } else {
      this.budget = new Budget();
    }
  }

  onPeriodSelected(period: NbCalendarRange<Date>) {
    if (period.end && period.start) {
      this.budget.startDate = period.start;
      this.budget.endDate = period.end;
    }
  }

  filledValues() {
    return (
      this.budget.amount > 0 &&
      this.budget.categoryId > 0 &&
      this.budget.startDate &&
      this.budget.endDate
    );
  }

  toNextStep() {
    if (!this.filledValues()) {
      this.toasterService.warning("", "Invalid data");
      return;
    }

    // TODO: Overlapping budgets
    this.stepper.next();
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }

  async submit() {
    let errors = this.validate();
    if (errors.length > 0) {
      this.toasterService.warning(errors.join("\n"), "Incorrect data");
      return;
    }

    if (this.editing) {
      this.budget = await this.budgetService.updateBudget(
        this.budget.id,
        this.budget.amount,
        this.budget.startDate,
        this.budget.endDate
      );
      this.dialogRef.close({ success: true, budget: this.budget });
    } else {
      this.budget = await this.budgetService.createBudget(
        this.budget.categoryId,
        this.budget.amount,
        this.budget.startDate,
        this.budget.endDate
      );
      this.dialogRef.close({ success: true, budget: this.budget });
    }
  }

  private validate() {
    let messages: string[] = [];

    if (this.budget.amount < 0)
      messages.push("Amount has to be greater than 0");

    // TODO: Add validation

    return messages;
  }
}
