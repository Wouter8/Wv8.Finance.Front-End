import { Observable } from 'rxjs';
import { Budget } from '../models/budget.model';
import { TransactionType } from '../enums/transaction-type.enum';
import { ICategory } from './category';
import { IntervalUnit } from '../enums/interval-unit';
import { RecurringBudget } from '../models/recurring-budget.model';
import { IMaybe } from 'wv8.typescript.core';

export interface IRecurringBudget {
  id: number;
  name: string;
  amount: number;
  categoryId: number;
  category: ICategory;
  startDate: string;
  endDate: IMaybe<string>;
  interval: number;
  intervalUnit: IntervalUnit;
}

export abstract class RecurringBudgetData {
  abstract getRecurringBudget(id: number): Observable<RecurringBudget>;
  abstract getRecurringBudgets(): Observable<RecurringBudget[]>;
  abstract updateRecurringBudget(recurringBudget: IRecurringBudget): Observable<RecurringBudget>;
  abstract createRecurringBudget(recurringBudget: IRecurringBudget):  Observable<RecurringBudget>;
  abstract deleteRecurringBudget(id: number): Observable<void>;
}
