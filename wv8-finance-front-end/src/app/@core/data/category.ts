import { Observable } from "rxjs";
import { Category } from "../models/category.model";
import { Maybe, IMaybe } from "wv8.typescript.core";
import { CategoryType } from "../enums/category-type";
import { IIcon } from "./icon";

export interface ICategory {
  id: number;
  description: string;
  type: CategoryType;
  parentCategoryId: IMaybe<number>;
  parentCategory: IMaybe<ICategory>;
  isObsolete: boolean;
  icon: IIcon;
  children: ICategory[];
}

export abstract class CategoryData {
  abstract getCategory(id: number): Promise<Category>;
  abstract getCategories(includeObsolete: boolean): Promise<Category[]>;
  abstract getCategoriesByFilter(
    includeObsolete: boolean,
    type: CategoryType
  ): Promise<Category[]>;
  abstract updateCategory(
    id: number,
    description: string,
    type: CategoryType,
    parentCategoryId: Maybe<number>,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Promise<Category>;
  abstract createCategory(
    description: string,
    type: CategoryType,
    parentCategoryId: Maybe<number>,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Promise<Category>;
  abstract setCategoryObsolete(id: number, obsolete: boolean): Promise<void>;
}
