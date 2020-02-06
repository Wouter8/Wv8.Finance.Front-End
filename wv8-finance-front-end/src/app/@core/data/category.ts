import { Observable } from "rxjs";
import { Category } from "../models/category.model";
import { Maybe, IMaybe } from "wv8.typescript.core";
import { CategoryType } from "../enums/category-type";
import { IIcon } from "./icon";

export interface ICategory {
  id: number;
  description: string;
  obsolete: boolean;
  parentCategoryId: IMaybe<number>;
  parentCategory: IMaybe<ICategory>;
  type: CategoryType;
  icon: IIcon;
}

export abstract class CategoryData {
  abstract getCategory(id: number): Observable<Category>;
  abstract getCategories(includeObsolete: boolean): Observable<Category[]>;
  abstract getCategoriesByFilter(
    includeObsolete: boolean,
    categoryType: Maybe<CategoryType>
  ): Observable<Category[]>;
  abstract updateCategory(
    id: number,
    description: string,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Observable<Category>;
  abstract createCategory(
    description: string,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Observable<Category>;
  abstract setCategoryObsolete(id: number, obsolete: boolean): Observable<void>;
}
