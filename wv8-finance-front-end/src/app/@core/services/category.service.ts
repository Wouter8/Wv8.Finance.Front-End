import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ICategory, CategoryData } from "../data/category";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { HttpService } from "../utils/http.service";
import { Category } from "../models/category.model";
import { CategoryType } from "../enums/category-type";
import { Maybe } from "wv8.typescript.core";

@Injectable()
export class CategoryService extends CategoryData {
  private static BaseUrl = `${environment.base_url}/categories`;

  constructor(private http: HttpService) {
    super();
  }

  getCategory(id: number): Observable<Category> {
    const url = `${CategoryService.BaseUrl}/${id}`;

    return this.http
      .get<ICategory>(url)
      .pipe(map(category => Category.fromDto(category)));
  }

  getCategories(includeObsolete: boolean = false): Observable<Category[]> {
    const url = `${CategoryService.BaseUrl}`;

    return this.http
      .get<ICategory[]>(url, { includeObsolete })
      .pipe(map(categories => categories.map(a => Category.fromDto(a))));
  }

  getCategoriesByFilter(
    includeObsolete: boolean,
    categoryType: Maybe<CategoryType>
  ): Observable<Category[]> {
    const url = `${CategoryService.BaseUrl}`;

    return this.http
      .get<ICategory[]>(url, { includeObsolete })
      .pipe(map(categories => categories.map(a => Category.fromDto(a))));
  }

  updateCategory(
    id: number,
    description: string,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Observable<Category> {
    const url = `${CategoryService.BaseUrl}/${id}`;

    return this.http
      .put<ICategory>(url, {
        description,
        iconPack,
        iconName,
        iconColor
      })
      .pipe(map(category => Category.fromDto(category)));
  }

  createCategory(
    description: string,
    iconPack: string,
    iconName: string,
    iconColor: string
  ): Observable<Category> {
    const url = `${CategoryService.BaseUrl}`;

    return this.http
      .post<ICategory>(url, {
        description,
        iconPack,
        iconName,
        iconColor
      })
      .pipe(map(category => Category.fromDto(category)));
  }

  setCategoryObsolete(id: number, obsolete: boolean): Observable<void> {
    const url = `${CategoryService.BaseUrl}/obsolete/${id}`;

    return this.http.put<void>(url, {
      obsolete
    });
  }
}
