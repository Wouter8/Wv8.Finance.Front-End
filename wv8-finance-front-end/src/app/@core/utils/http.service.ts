import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public get<T>(url: string, queryParams: any = null): Observable<T> {
    let params = this.getParams(queryParams);
    return this.http.get<T>(url, { params });
  }

  public post<T>(
    url: string,
    queryParams: any = null,
    body: any = null
  ): Observable<T> {
    let query = this.getParams(queryParams);
    if (!body) body = {};
    return this.http.post<T>(url, body, { params: query });
  }

  public put<T>(
    url: string,
    queryParams: any = null,
    body: any = null
  ): Observable<T> {
    let query = this.getParams(queryParams);
    if (!body) body = {};
    return this.http.put<T>(url, body, { params: query });
  }

  private getParams(data: any): HttpParams {
    if (data === null || data === undefined) data = {};

    let params = new HttpParams();
    for (var key in data) {
      params = params.append(key, data[key]);
    }

    return params;
  }
}
