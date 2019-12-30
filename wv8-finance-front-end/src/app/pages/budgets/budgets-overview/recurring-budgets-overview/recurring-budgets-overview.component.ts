import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomTableSettings } from '../../../../@theme/components/table/table-settings.model';
import { RecurringBudget } from '../../../../@core/models/recurring-budget.model';
import { TableDefaultAndObsoleteCellComponent } from '../../../../@theme/components/table/table-default-and-obsolete-cell/table-default-and-obsolete-cell.component';
import { TableEuroCellComponent } from '../../../../@theme/components/table/table-euro-cell/table-euro-cell.component';
import { Budget } from '../../../../@core/models/budget.model';
import { TableComponent } from '../../../../@theme/components/table/table.component';
import { IRecurringBudget, RecurringBudgetData } from '../../../../@core/data/recurring-budget';
import { BudgetData } from '../../../../@core/data/budget';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { CreateOrEditBudgetComponent } from '../../create-or-edit-budget/create-or-edit-budget.component';
import { CreateOrEditRecurringBudgetComponent } from '../create-or-edit-recurring-budget/create-or-edit-recurring-budget.component';

@Component({
  selector: 'recurring-budgets-overview',
  templateUrl: './recurring-budgets-overview.component.html',
  styleUrls: ['./recurring-budgets-overview.component.scss']
})
export class RecurringBudgetsOverviewComponent implements OnInit {
  @ViewChild("table", { static: true })
  table: TableComponent<RecurringBudget>;

  budgets: RecurringBudget[] = [];

  constructor(
    private recurringBudgetService: RecurringBudgetData,
    private router: Router,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService) { }

  ngOnInit() {
    this.table.setSettings(this.getTableSettings());
    this.loadData();
  }

  onSelect(event: IRecurringBudget) {
    this.router.navigateByUrl(`budgets/recurring/${event.id}`);
  }

  onClickAdd(event: MouseEvent) {
    this.dialogService
      .open(CreateOrEditRecurringBudgetComponent)
      .onClose.subscribe((data: { success: boolean; budget: RecurringBudget }) => {
        if (data.success) {
          this.recurringBudgetService.createRecurringBudget(data.budget.serialize()).subscribe(budget => {
            this.budgets.push(budget);
            this.loadData();

            this.toasterService.success("", "Added budget");
          });
        }
      });
  }

  private loadData() {
    this.recurringBudgetService.getRecurringBudgets().subscribe(budgets => {
      this.budgets = budgets;
      this.setBudgetList();
    });
  }

  private setBudgetList() {
    this.table.setData(this.budgets);
  }

  private getTableSettings(): CustomTableSettings<RecurringBudget> {
    return {
      columns: {
        id: {
          title: "ID",
          type: "text",
          sort: false,
          width: "60px",
        },
        name: {
          title: "Name",
          type: "custom",
          renderComponent: TableDefaultAndObsoleteCellComponent,
          sort: false
        },
        startBalance: {
          title: "Start Balance",
          type: "custom",
          renderComponent: TableEuroCellComponent,
          sort: false
        }
      },
      hideFilter: true,
      clickable: true,
    };
  }

}
