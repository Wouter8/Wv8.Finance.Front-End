import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { TableComponent } from "../../../@theme/components/table/table.component";
import { TableDefaultAndObsoleteCellComponent } from "../../../@theme/components/table/table-default-and-obsolete-cell/table-default-and-obsolete-cell.component";
import { TableEuroCellComponent } from "../../../@theme/components/table/table-euro-cell/table-euro-cell.component";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NbDialogService,
  NbToast,
  NbToastrService,
  NbCalendarRange,
  NbDatepicker,
  NbRangepickerComponent,
  NbDateService,
} from "@nebular/theme";
import { IBudget, BudgetData } from "../../../@core/data/budget";
import { CreateOrEditBudgetComponent } from "../create-or-edit-budget/create-or-edit-budget.component";
import { Budget } from "../../../@core/models/budget.model";
import { TableDateCellComponent } from "../../../@theme/components/table/table-date-cell/table-date-cell.component";
import { TableNameCellComponent } from "../../../@theme/components/table/table-name-cell/table-name-cell.component";
import { TableProgressCellComponent } from "../../../@theme/components/table/table-progress-cell/table-progress-cell.component";
import { Maybe } from "@wv8/typescript.core";

@Component({
  selector: "budgets-overview",
  templateUrl: "./budgets-overview.component.html",
  styleUrls: ["./budgets-overview.component.scss"],
})
export class BudgetsOverviewComponent implements OnInit {
  budgets: Budget[] = [];

  constructor(
    private budgetService: BudgetData,
    private router: Router,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService
  ) {}

  ngOnInit() {}

  onClickAdd(event: MouseEvent) {
    this.dialogService.open(CreateOrEditBudgetComponent).onClose.subscribe((data: { success: boolean; budget: Budget }) => {
      if (data.success) {
        this.budgets.push(data.budget);
        this.setBudgetList();

        this.toasterService.success("", "Added budget");
      }
    });
  }

  onSetPeriod(event: NbCalendarRange<Date>) {
    if (event.start && event.end) {
      this.loadData(event);
    }
  }

  private async loadData(range: NbCalendarRange<Date>) {
    this.budgets = await this.budgetService.getBudgetsByFilter(Maybe.none(), new Maybe(range.start), new Maybe(range.end));
    this.setBudgetList();
  }

  private setBudgetList() {
    this.budgets = [...this.budgets];
  }
}
