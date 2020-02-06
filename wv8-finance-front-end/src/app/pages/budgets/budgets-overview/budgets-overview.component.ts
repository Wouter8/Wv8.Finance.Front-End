import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { TableComponent } from "../../../@theme/components/table/table.component";
import { CustomTableSettings } from "../../../@theme/components/table/table-settings.model";
import { TableDefaultAndObsoleteCellComponent } from "../../../@theme/components/table/table-default-and-obsolete-cell/table-default-and-obsolete-cell.component";
import { TableEuroCellComponent } from "../../../@theme/components/table/table-euro-cell/table-euro-cell.component";
import { Router, ActivatedRoute } from "@angular/router";
import { NbDialogService, NbToast, NbToastrService, NbCalendarRange, NbDatepicker, NbRangepickerComponent, NbDateService } from "@nebular/theme";
import { IBudget, BudgetData } from '../../../@core/data/budget';
import { CreateOrEditBudgetComponent } from '../create-or-edit-budget/create-or-edit-budget.component';
import { Budget } from '../../../@core/models/budget.model';
import { RecurringBudget } from '../../../@core/models/recurring-budget.model';
import { TableDateCellComponent } from '../../../@theme/components/table/table-euro-cell copy/table-date-cell.component';
import { TableNameCellComponent } from '../../../@theme/components/table/table-name-cell/table-name-cell.component';
import { TableProgressCellComponent } from '../../../@theme/components/table/table-progress-cell/table-progress-cell.component';
import { Maybe } from 'wv8.typescript.core';

@Component({
  selector: "budgets-overview",
  templateUrl: "./budgets-overview.component.html",
  styleUrls: ["./budgets-overview.component.scss"]
})
export class BudgetsOverviewComponent implements OnInit {
  @ViewChild("table", { static: true })
  table: TableComponent<Budget>;

  @ViewChild("periodPicker", { static: true })
  periodPicker: NbRangepickerComponent<Date>;
  
  @ViewChild("periodPickerInput", { static: true })
  periodPickerInput: ElementRef<HTMLInputElement>;

  budgets: Budget[] = [];

  constructor(
    private budgetService: BudgetData,
    private router: Router,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService,
    private dateService: NbDateService<Date>,
  ) {}

  ngOnInit() {
    let today = new Date();
    let range: NbCalendarRange<Date> = {
      start: this.dateService.getMonthStart(today),
      end: this.dateService.getMonthEnd(today),
    }
    this.periodPicker.range = range;
    this.periodPickerInput.nativeElement.value = `${this.dateService.format(range.start, "d MMM yy")} - ${this.dateService.format(range.end, "d MMM yy")}`;

    this.table.setSettings(this.getTableSettings());
    this.loadData(range);
  }

  onSelect(event: IBudget) {
    this.router.navigateByUrl(`budgets/${event.id}`);
  }

  onClickAdd(event: MouseEvent) {
    this.dialogService
      .open(CreateOrEditBudgetComponent)
      .onClose.subscribe((data: { success: boolean; budget: Budget }) => {
        if (data.success) {
          this.budgetService.createBudget(data.budget.serialize()).subscribe(budget => {
            this.budgets.push(budget);
            this.setBudgetList();

            this.toasterService.success("", "Added budget");
          });
        }
      });
  }

  onSetPeriod(event: NbCalendarRange<Date>) {
    if (event.start && event.end) {
      this.loadData(event);
    }
  }

  private loadData(range: NbCalendarRange<Date>) {
    this.budgetService.getBudgetsByFilter(Maybe.none(), new Maybe(range.start), new Maybe(range.end)).subscribe(budgets => {
      this.budgets = budgets;
      this.setBudgetList();
    });
  }

  private setBudgetList() {
    this.table.setData(this.budgets);
  }

  private getTableSettings(): CustomTableSettings<Budget> {
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
          renderComponent: TableNameCellComponent,
          sort: false,
          onComponentInitFunction: (instance: TableNameCellComponent) => {
            instance.overrideProperty = 'category';
          }
        },
        amount: {
          title: "Amount",
          type: "custom",
          renderComponent: TableEuroCellComponent,
          sort: false,
        },
        startDate: {
          title: "Start Date",
          type: "custom",
          renderComponent: TableDateCellComponent,
          sort: false,
        },
        endDate: {
          title: "End Date",
          type: "custom",
          renderComponent: TableDateCellComponent,
          sort: false,
        },
        spentPercentage:  {
          title: "Spent",
          type: "custom",
          renderComponent: TableProgressCellComponent,
          sort: false,
          onComponentInitFunction: (instance: TableProgressCellComponent) => {
            instance.invertStatus = true;
          }
        }
      },
      hideFilter: true,
      clickable: true,
      rowClassFunction: (row: Budget) => {
        let classes: string[] = [];
        return classes;
      }
    };
  }
}
