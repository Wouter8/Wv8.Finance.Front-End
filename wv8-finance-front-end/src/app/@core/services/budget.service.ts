import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IBudget, BudgetData } from "../data/budget";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { HttpService } from "../utils/http.service";
import { Budget } from "../models/budget.model";
import { Maybe } from "@wv8/typescript.core";

@Injectable()
export class BudgetService extends BudgetData {
  private static BaseUrl = `${environment.base_url}/budgets`;

  constructor(private http: HttpService) {
    super();
  }

  getBudget(id: number): Promise<Budget> {
    const url = `${BudgetService.BaseUrl}/${id}`;

    return this.http
      .get<IBudget>(url)
      .pipe(map(budget => Budget.fromDto(budget)))
      .toPromise();
  }

  getBudgets(): Promise<Budget[]> {
    const url = `${BudgetService.BaseUrl}`;

    return this.http
      .get<IBudget[]>(url)
      .pipe(map(budgets => budgets.map(a => Budget.fromDto(a))))
      .toPromise();
  }

  getBudgetsByFilter(
    categoryId: Maybe<number>,
    startDate: Maybe<Date>,
    endDate: Maybe<Date>
  ): Promise<Budget[]> {
    const url = `${BudgetService.BaseUrl}/filter`;

    return this.http
      .get<IBudget[]>(url, {
        categoryId: categoryId.asQueryParam(),
        startDate: startDate
          .map(d => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`)
          .asQueryParam(),
        endDate: endDate
          .map(d => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`)
          .asQueryParam()
      })
      .pipe(map(budgets => budgets.map(a => Budget.fromDto(a))))
      .toPromise();
  }

  updateBudget(
    id: number,
    amount: number,
    startDate: Date,
    endDate: Date
  ): Promise<Budget> {
    const url = `${BudgetService.BaseUrl}/${id}`;

    return this.http
      .put<IBudget>(url, {
        amount,
        startDate: `${startDate.getMonth() +
          1}/${startDate.getDate()}/${startDate.getFullYear()}`,
        endDate: `${endDate.getMonth() +
          1}/${endDate.getDate()}/${endDate.getFullYear()}`
      })
      .pipe(map(budget => Budget.fromDto(budget)))
      .toPromise();
  }

  createBudget(
    categoryId: number,
    amount: number,
    startDate: Date,
    endDate: Date
  ): Promise<Budget> {
    const url = `${BudgetService.BaseUrl}`;

    return this.http
      .post<IBudget>(url, {
        categoryId,
        amount,
        startDate: `${startDate.getMonth() +
          1}/${startDate.getDate()}/${startDate.getFullYear()}`,
        endDate: `${endDate.getMonth() +
          1}/${endDate.getDate()}/${endDate.getFullYear()}`
      })
      .pipe(map(budget => Budget.fromDto(budget)))
      .toPromise();
  }

  deleteBudget(id: number): Promise<void> {
    const url = `${BudgetService.BaseUrl}/${id}`;

    return this.http.delete<void>(url).toPromise();
  }
}
