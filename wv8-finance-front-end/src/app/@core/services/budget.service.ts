import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IBudget, BudgetData } from "../data/budget";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { HttpService } from "../utils/http.service";
import { Budget } from "../models/budget.model";
import { Maybe } from "wv8.typescript.core";

@Injectable()
export class BudgetService extends BudgetData {
  private static BaseUrl = `${environment.base_url}/budgets`;

  constructor(private http: HttpService) {
    super();
  }

  getBudget(id: number): Observable<Budget> {
    const url = `${BudgetService.BaseUrl}/${id}`;

    return this.http
      .get<IBudget>(url)
      .pipe(map(budget => Budget.fromDto(budget)));
  }

  getBudgets(): Observable<Budget[]> {
    const url = `${BudgetService.BaseUrl}`;

    return this.http
      .get<IBudget[]>(url)
      .pipe(map(budgets => budgets.map(a => Budget.fromDto(a))));
  }

  getBudgetsByFilter(
    categoryId: Maybe<number>,
    startDate: Maybe<Date>,
    endDate: Maybe<Date>
  ): Observable<Budget[]> {
    const url = `${BudgetService.BaseUrl}/filter`;

    return this.http
      .get<IBudget[]>(url, {
        categoryId: categoryId.asQueryParam(),
        startDate: startDate.map(d => d.toISOString()).asQueryParam(),
        endDate: endDate.map(d => d.toISOString()).asQueryParam()
      })
      .pipe(map(budgets => budgets.map(a => Budget.fromDto(a))));
  }

  updateBudget(
    id: number,
    description: string,
    amount: number,
    startDate: Date,
    endDate: Date
  ): Observable<Budget> {
    const url = `${BudgetService.BaseUrl}/${id}`;

    return this.http
      .put<IBudget>(url, {
        description,
        amount,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
      .pipe(map(budget => Budget.fromDto(budget)));
  }

  createBudget(
    description: string,
    categoryId: number,
    amount: number,
    startDate: Date,
    endDate: Date
  ): Observable<Budget> {
    const url = `${BudgetService.BaseUrl}`;

    return this.http
      .post<IBudget>(url, {
        description,
        categoryId,
        amount,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
      .pipe(map(budget => Budget.fromDto(budget)));
  }

  deleteBudget(id: number): Observable<void> {
    const url = `${BudgetService.BaseUrl}/obsolete/${id}`;

    return this.http.delete<void>(url);
  }
}
