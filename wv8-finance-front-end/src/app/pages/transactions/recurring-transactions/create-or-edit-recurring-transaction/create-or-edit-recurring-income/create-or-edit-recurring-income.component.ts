import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";
import { Maybe } from "@wv8/typescript.core";
import { NbDatepicker, NbDateService, NbCalendarRange } from "@nebular/theme";
import { RecurringTransaction } from "../../../../../@core/models/recurring-transaction.model";
import { IntervalUnit } from "../../../../../@core/enums/interval-unit";
import { Account } from "../../../../../@core/models/account.model";
import { Category } from "../../../../../@core/models/category.model";

@Component({
  selector: "create-or-edit-recurring-income",
  templateUrl: "./create-or-edit-recurring-income.component.html",
  styleUrls: ["./create-or-edit-recurring-income.component.scss"],
})
export class CreateOrEditRecurringIncomeComponent implements OnInit {
  @Input() recurringTransaction: RecurringTransaction;
  @Input() editing: boolean;
  @Input() accounts: Account[];
  @Input() categories: Category[];

  @Input() updateInstances: boolean;
  @Output() updateInstancesChange = new EventEmitter<boolean>();

  intervalUnits = IntervalUnit;

  constructor() {}

  ngOnInit() {}

  periodChanged(period: NbCalendarRange<Date>) {
    this.recurringTransaction.startDate = new Date(period.start);
    this.recurringTransaction.endDate = new Maybe(period.end).map(s => new Date(s));
  }

  setAccount(account: Account[]) {
    this.recurringTransaction.account = account[0];
    this.recurringTransaction.accountId = account[0].id;
  }

  setCategory(category: Category[]) {
    this.recurringTransaction.category = new Maybe(category[0]);
    this.recurringTransaction.categoryId = new Maybe(category[0].id);
  }

  public categoryId = (c: Category) => c.id;
  public categoryTitle = (c: Category) => c.description;
  public categoryIcon = Maybe.some((c: Category) => c.icon);
  public categoryChildren = Maybe.some((c: Category) => c.children);

  public accountId = (a: Account) => a.id;
  public accountTitle = (a: Account) => a.description;
  public accountIcon = Maybe.some((a: Account) => a.icon);

  onUpdateInstanceChange(val: boolean) {
    this.updateInstancesChange.emit(val);
  }
}
