import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Maybe } from "@wv8/typescript.core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { ConfirmDialogComponent } from "../../../@theme/components/confirm-dialog/confirm-dialog.component";
import { Budget } from "../../../@core/models/budget.model";
import { BudgetData } from "../../../@core/data/budget";
import { CreateOrEditBudgetComponent } from "../create-or-edit-budget/create-or-edit-budget.component";

@Component({
  selector: "budget",
  templateUrl: "./budget.component.html",
  styleUrls: ["./budget.component.scss"]
})
export class BudgetComponent implements OnInit {
  budget: Budget;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private budgetService: BudgetData,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      let id = new Maybe<number>(params.id);
      if (id.isSome) {
        try {
          this.budget = await this.budgetService.getBudget(id.value);
        } catch {
          this.toasterService.danger("", "budget not found");
          this.router.navigateByUrl("/budgets");
        }
      }
    });
  }

  async onDeleteClick() {
    this.dialogService
      .open(ConfirmDialogComponent, {
        context: { body: `Delete budget?` }
      })
      .onClose.subscribe(async (confirmed: boolean) => {
        if (confirmed) {
          await this.budgetService.deleteBudget(this.budget.id);

          this.toasterService.success("", "Deleted budget");
          this.router.navigateByUrl("/budgets");
        }
      });
  }

  onEditClick() {
    this.dialogService
      .open(CreateOrEditBudgetComponent, {
        context: { budget: this.budget.copy() }
      })
      .onClose.subscribe((data: { success: boolean; budget: Budget }) => {
        if (data.success) {
          this.budget = data.budget;

          this.toasterService.success("", "Updated budget");
        }
      });
  }
}
