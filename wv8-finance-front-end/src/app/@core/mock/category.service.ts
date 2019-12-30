import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ICategory, CategoryData } from "../data/category";
import { Category } from "../models/category.model";
import { map } from "rxjs/operators";
import { Maybe } from "wv8.typescript.core";
import { CategoryType } from "../enums/category-type";

@Injectable()
export class CategoryService extends CategoryData {
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

  getCategory(id: number): Observable<Category> {
    let category = this.categories.filter(a => a.id == id)[0];

    if (!category) throw new Error("Category not found");

    return observableOf(category).pipe(map(a => Category.fromDto(a)));
  }

  getCategories(includeObsolete: boolean): Observable<Category[]> {
    return observableOf(
      includeObsolete
        ? this.categories
        : this.categories.filter(c => !c.obsolete)
    ).pipe(map(categories => categories.map(a => Category.fromDto(a))));
  }

  getCategoriesByFilter(
    includeObsolete: boolean,
    categoryType: Maybe<CategoryType>
  ): Observable<Category[]> {
    let categories = categoryType.isSome
      ? this.categories.filter(c => c.type === categoryType.value)
      : this.categories;

    categories = includeObsolete
      ? categories
      : categories.filter(c => !c.obsolete);

    return observableOf(categories).pipe(
      map(categories => categories.map(a => Category.fromDto(a)))
    );
  }

  updateCategory(category: Category): Observable<Category> {
    let index = this.categories.indexOf(
      this.categories.find(a => a.id === category.id)
    );

    this.categories[index] = category.serialize();

    return observableOf(this.categories[index]).pipe(
      map(a => Category.fromDto(a))
    );
  }

  createCategory(category: Category): Observable<Category> {
    category.id = this.categories[this.categories.length - 1].id + 1;

    this.categories.push(category.serialize());

    return observableOf(this.categories[this.categories.length - 1]).pipe(
      map(a => Category.fromDto(a))
    );
  }

  setCategoryObsolete(id: number, obsolete: boolean): Observable<Category> {
    let category = this.categories.find(a => a.id === id);
    let index = this.categories.indexOf(category);

    category.obsolete = obsolete;

    this.categories[index] = category;

    return observableOf(this.categories[index]).pipe(
      map(a => Category.fromDto(a))
    );
  }
}
