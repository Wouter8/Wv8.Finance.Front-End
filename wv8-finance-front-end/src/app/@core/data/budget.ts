import { Observable } from "rxjs";
import { TransactionType } from "../enums/transaction-type.enum";
import { ICategory } from "./category";
import { IntervalUnit } from "../enums/interval-unit";
import { Maybe, IMaybe } from "wv8.typescript.core";
import { Budget } from "../models/budget.model";

export interface IBudget {
  id: number;
  description: string;
  amount: number;
  categoryId: number;
  category: ICategory;
  startDate: string;
  endDate: string;
  spent: number;
}

export abstract class BudgetData {
  abstract getBudget(id: number): Observable<Budget>;
  abstract getBudgets(): Observable<Budget[]>;
  abstract getBudgetsByFilter(
    categoryId: Maybe<number>,
    startDate: Maybe<Date>,
    endDate: Maybe<Date>
  ): Observable<Budget[]>;
  abstract updateBudget(
    id: number,
    description: string,
    amount: number,
    startDate: Date,
    endDate: Date
  ): Observable<Budget>;
  abstract createBudget(
    description: string,
    categoryId: number,
    amount: number,
    startDate: Date,
    endDate: Date
  ): Observable<Budget>;
  abstract deleteBudget(id: number): Observable<void>;
}
