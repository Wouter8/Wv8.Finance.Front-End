import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IBudget, BudgetData } from "../data/budget";
import { Budget } from "../models/budget.model";
import { map } from "rxjs/operators";
import { RecurringBudgetData, IRecurringBudget } from '../data/recurring-budget';
import { RecurringBudget } from '../models/recurring-budget.model';

@Injectable()
export class RecurringBudgetService extends RecurringBudgetData {
  private budgets: IRecurringBudget[] = [];

  getRecurringBudget(id: number): Observable<RecurringBudget> {
    let budget = this.budgets.filter(a => a.id == id)[0];

    if (!budget) throw new Error("Budget not found");

    return observableOf(budget).pipe(map(a => RecurringBudget.fromDto(a)));
  }

  getRecurringBudgets(): Observable<RecurringBudget[]> {
    return observableOf(this.budgets).pipe(
      map(budgets => budgets.map(a => RecurringBudget.fromDto(a)))
    );
  }

  updateRecurringBudget(recurringBudget: IRecurringBudget): Observable<RecurringBudget> {
    let index = this.budgets.indexOf(
      this.budgets.find(a => a.id === recurringBudget.id)
    );

    this.budgets[index] = recurringBudget;

    return observableOf(this.budgets[index]).pipe(
      map(a => RecurringBudget.fromDto(a))
    );
  }

  createRecurringBudget(recurringBudget: IRecurringBudget): Observable<RecurringBudget> {
    recurringBudget.id = this.budgets[this.budgets.length - 1].id + 1;

    this.budgets.push(recurringBudget);

    return observableOf(this.budgets[this.budgets.length - 1]).pipe(
      map(a => RecurringBudget.fromDto(a))
    );
  }

  deleteRecurringBudget(id: number): Observable<void> {
    let budget = this.budgets.find(a => a.id === id);
    let index = this.budgets.indexOf(budget);
    
    this.budgets.splice(index, 1);

    return new Observable();
  }
}
