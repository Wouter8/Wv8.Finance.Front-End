import { Observable } from "rxjs";
import { Category } from "../models/category.model";
import { Maybe, IMaybe } from "wv8.typescript.core";
import { CategoryType } from "../enums/category-type";

export interface ICategory {
  id: number;
  name: string;
  obsolete: boolean;
  parentCategoryId: IMaybe<number>;
  parentCategory: IMaybe<ICategory>;
  type: CategoryType;
  icon: string;
  iconPack: string;
  color: string;
}

export abstract class CategoryData {
  abstract getCategory(id: number): Observable<Category>;
  abstract getCategories(includeObsolete: boolean): Observable<Category[]>;
  abstract getCategoriesByFilter(includeObsolete: boolean, categoryType: Maybe<CategoryType>): Observable<Category[]>;
  abstract updateCategory(category: Category): Observable<Category>;
  abstract createCategory(category: Category): Observable<Category>;
  abstract setCategoryObsolete(
    id: number,
    obsolete: boolean
  ): Observable<Category>;
}
