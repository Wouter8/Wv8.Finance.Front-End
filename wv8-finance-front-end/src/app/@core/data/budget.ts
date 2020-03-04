import { Observable } from "rxjs";
import { TransactionType } from "../enums/transaction-type.enum";
import { ICategory } from "./category";
import { IntervalUnit } from "../enums/interval-unit";
import { Maybe, IMaybe } from "@wv8/typescript.core";
import { Budget } from "../models/budget.model";

export interface IBudget {
  id: number;
  amount: number;
  categoryId: number;
  category: ICategory;
  startDate: string;
  endDate: string;
  spent: number;
}

export abstract class BudgetData {
  abstract getBudget(id: number): Promise<Budget>;
  abstract getBudgets(): Promise<Budget[]>;
  abstract getBudgetsByFilter(
    categoryId: Maybe<number>,
    startDate: Maybe<Date>,
    endDate: Maybe<Date>
  ): Promise<Budget[]>;
  abstract updateBudget(
    id: number,
    amount: number,
    startDate: Date,
    endDate: Date
  ): Promise<Budget>;
  abstract createBudget(
    categoryId: number,
    amount: number,
    startDate: Date,
    endDate: Date
  ): Promise<Budget>;
  abstract deleteBudget(id: number): Promise<void>;
}
