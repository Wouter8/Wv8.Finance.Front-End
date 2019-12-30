import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef, NbToastrService, NbToastrConfig } from "@nebular/theme";
import { RecurringBudget } from '../../../../@core/models/recurring-budget.model';

@Component({
  selector: "create-or-edit-recurring-budget",
  templateUrl: "./create-or-edit-recurring-budget.component.html",
  styleUrls: ["./create-or-edit-recurring-budget.component.scss"]
})
export class CreateOrEditRecurringBudgetComponent implements OnInit {
  @Input()
  budget: RecurringBudget;

  editing = false;
  header: string = "Creating new budget";

  constructor(
    protected dialogRef: NbDialogRef<CreateOrEditRecurringBudgetComponent>,
    private toasterService: NbToastrService
  ) {}

  ngOnInit() {
    if (this.budget) {
      this.editing = true;
      this.budget = this.budget.copy();
      this.header = `Editing ${this.budget.name}`;
    } else {
      this.budget = new RecurringBudget();
    }
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }

  submit() {
    let errors = this.validate();
    if (errors.length > 0) {
      this.toasterService.warning(errors[0], 'Incorrect data');
      return;
    }

    this.dialogRef.close({ success: true, budget: this.budget });
  }

  private validate() {
    let messages: string[] = [];

    if (this.budget.name.trim().length < 3)
      messages.push("Name must contain at least 3 characters");

    return messages;
  }
}
