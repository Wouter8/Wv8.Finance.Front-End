import { Component, OnInit, Input, ViewChild } from "@angular/core";
import {
  NbDialogRef,
  NbToastrService,
  NbToastrConfig,
  NbCalendarRange,
  NbStepperComponent
} from "@nebular/theme";
import { Budget } from "../../../@core/models/budget.model";
import { BudgetData } from "../../../@core/data/budget";
import { Maybe } from "wv8.typescript.core";
import { OverlappingType } from "../../../@core/enums/overlapping-type";

@Component({
  selector: "create-or-edit-budget",
  templateUrl: "./create-or-edit-budget.component.html",
  styleUrls: ["./create-or-edit-budget.component.scss"]
})
export class CreateOrEditBudgetComponent implements OnInit {
  @ViewChild("stepper", { static: true })
  stepper: NbStepperComponent;

  @Input()
  budget: Budget;

  editing = false;
  header: string = "Creating new budget";

  OverlappingType = OverlappingType;

  constructor(
    protected dialogRef: NbDialogRef<CreateOrEditBudgetComponent>,
    private budgetService: BudgetData,
    private toasterService: NbToastrService
  ) {}

  ngOnInit() {
    if (this.budget) {
      this.editing = true;
      this.budget = this.budget.copy();
      this.header = `Editing budget`;
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
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }

  submit() {
    let errors = this.validate();
    if (errors.length > 0) {
      this.toasterService.warning(errors[0], "Incorrect data");
      return;
    }

    this.dialogRef.close({ success: true, budget: this.budget });
  }

  private validate() {
    let messages: string[] = [];

    // TODO

    return messages;
  }
}
