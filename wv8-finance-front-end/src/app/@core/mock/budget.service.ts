import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IBudget, BudgetData } from "../data/budget";
import { Budget } from "../models/budget.model";
import { map } from "rxjs/operators";
import { ICategory } from "../data/category";
import { Maybe } from "wv8.typescript.core";
import { CategoryType } from "../enums/category-type";

@Injectable()
export class BudgetService extends BudgetData {
  private categories: ICategory[] = [
    {
      id: 1,
      name: "Huis",
      parentCategoryId: Maybe.none<number>().serialize(),
      parentCategory: Maybe.none<ICategory>().serialize(),
      type: CategoryType.Expense,
      obsolete: false,
      icon: "home",
      iconPack: "fas",
      color: "#ba1307"
    },
    {
      id: 2,
      name: "Salaris",
      parentCategoryId: Maybe.none<number>().serialize(),
      parentCategory: Maybe.none<ICategory>().serialize(),
      type: CategoryType.Income,
      obsolete: false,
      icon: "euro-sign",
      iconPack: "fas",
      color: "#82c91e"
    },
    {
      id: 3,
      name: "Auto",
      parentCategoryId: Maybe.none<number>().serialize(),
      parentCategory: Maybe.none<ICategory>().serialize(),
      type: CategoryType.Expense,
      obsolete: true,
      icon: "car",
      iconPack: "fas",
      color: "#ba1307"
    }
  ];

  private budgets: IBudget[] = [
    {
      id: 1,
      amount: 30,
      categoryId: 1,
      category: this.categories[0],
      startDate: "2019-10-01T00:00:00+0000",
      endDate: "2019-10-31T00:00:00+0000",
      spent: 10
    },
    {
      id: 2,
      amount: 30,
      categoryId: 1,
      category: this.categories[0],
      startDate: "2019-11-01T00:00:00+0000",
      endDate: "2019-11-30T00:00:00+0000",
      spent: 20
    },
    {
      id: 3,
      amount: 30,
      categoryId: 1,
      category: this.categories[0],
      startDate: "2019-12-01T00:00:00+0000",
      endDate: "2019-12-31T00:00:00+0000",
      spent: 30
    },
    {
      id: 4,
      amount: 50,
      categoryId: 2,
      category: this.categories[1],
      startDate: "2019-11-01T00:00:00+0000",
      endDate: "2019-12-31T00:00:00+0000",
      spent: 5
    },
    {
      id: 5,
      amount: 30,
      categoryId: 1,
      category: this.categories[0],
      startDate: "2019-11-10T00:00:00+0000",
      endDate: "2019-11-20T00:00:00+0000",
      spent: 50
    }
  ];

  getBudget(id: number): Observable<Budget> {
    let budget = this.budgets.filter(a => a.id == id)[0];

    if (!budget) throw new Error("Budget not found");

    return observableOf(budget).pipe(map(a => Budget.fromDto(a)));
  }

  getBudgets(): Observable<Budget[]> {
    return observableOf(this.budgets).pipe(
      map(budgets => budgets.map(a => Budget.fromDto(a)))
    );
  }

  getBudgetsByFilter(
    categoryId: Maybe<number>,
    startDate: Maybe<Date>,
    endDate: Maybe<Date>
  ): Observable<Budget[]> {
    let found: IBudget[] = [];

    this.budgets.forEach(budget => {
      let correctCategory = categoryId.isSome
        ? categoryId.value === budget.categoryId
        : true;

      let budgetStartDate = new Date(budget.startDate);
      let budgetEndDate = new Date(budget.endDate);

      var withinPeriod =
        startDate.isSome && endDate.isSome
          ? (budgetStartDate < startDate.value && budgetEndDate > endDate.value) ||
            (budgetStartDate > startDate.value && budgetStartDate < endDate.value) ||
            (budgetEndDate > startDate.value && budgetEndDate < endDate.value)
          : true;

      if (correctCategory && withinPeriod) found.push(budget);
    });

    return observableOf(found).pipe(
      map(budgets => budgets.map(a => Budget.fromDto(a)))
    );
  }

  updateBudget(budget: IBudget): Observable<Budget> {
    let index = this.budgets.indexOf(
      this.budgets.find(a => a.id === budget.id)
    );

    this.budgets[index] = budget;

    return observableOf(this.budgets[index]).pipe(map(a => Budget.fromDto(a)));
  }

  createBudget(budget: IBudget): Observable<Budget> {
    budget.id = this.budgets[this.budgets.length - 1].id + 1;

    this.budgets.push(budget);

    return observableOf(this.budgets[this.budgets.length - 1]).pipe(
      map(a => Budget.fromDto(a))
    );
  }

  deleteBudget(id: number): Observable<void> {
    let budget = this.budgets.find(a => a.id === id);
    let index = this.budgets.indexOf(budget);

    this.budgets.splice(index, 1);

    return observableOf(null);
  }
}
