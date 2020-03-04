import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ICategory, CategoryData } from "../data/category";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { HttpService } from "../utils/http.service";
import { Category } from "../models/category.model";
import { CategoryType } from "../enums/category-type";
import { Maybe } from "@wv8/typescript.core";

@Injectable()
export class CategoryService extends CategoryData {
  private static BaseUrl = `${environment.base_url}/categories`;

  constructor(private http: HttpService) {
    super();
  }

  getCategory(id: number): Promise<Category> {
    const url = `${CategoryService.BaseUrl}/${id}`;

    return this.http
      .get<ICategory>(url)
      .pipe(map(category => Category.fromDto(category)))
      .toPromise();
  }

  getCategories(includeObsolete: boolean, group: boolean): Promise<Category[]> {
    const url = `${CategoryService.BaseUrl}`;

    return this.http
      .get<ICategory[]>(url, { includeObsolete, group })
      .pipe(map(categories => categories.map(a => Category.fromDto(a))))
      .toPromise();
  }

  getCategoriesByFilter(
    includeObsolete: boolean,
    type: CategoryType,
    group: boolean
  ): Promise<Category[]> {
    const url = `${CategoryService.BaseUrl}/filter`;

    return this.http
      .get<ICategory[]>(url, { includeObsolete, type, group })
      .pipe(map(categories => categories.map(a => Category.fromDto(a))))
      .toPromise();
  }

  updateCategory(
    id: number,
    description: string,
    type: CategoryType,
    parentCategoryId: Maybe<number>,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Promise<Category> {
    const url = `${CategoryService.BaseUrl}/${id}`;

    return this.http
      .put<ICategory>(url, {
        description,
        type,
        parentCategoryId: parentCategoryId.asQueryParam(),
        iconPack,
        iconName,
        iconColor
      })
      .pipe(map(category => Category.fromDto(category)))
      .toPromise();
  }

  createCategory(
    description: string,
    type: CategoryType,
    parentCategoryId: Maybe<number>,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Promise<Category> {
    const url = `${CategoryService.BaseUrl}`;

    return this.http
      .post<ICategory>(url, {
        description,
        type,
        parentCategoryId: parentCategoryId.asQueryParam(),
        iconPack,
        iconName,
        iconColor
      })
      .pipe(map(category => Category.fromDto(category)))
      .toPromise();
  }

  setCategoryObsolete(id: number, obsolete: boolean): Promise<void> {
    const url = `${CategoryService.BaseUrl}/obsolete/${id}`;

    return this.http
      .put<void>(url, {
        obsolete
      })
      .toPromise();
  }
}
