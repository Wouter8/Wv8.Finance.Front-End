import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { HttpService } from "../utils/http.service";
import {
  ReportData,
  ICurrentDateReport,
  ICategoryReport,
  IAccountReport,
  IPeriodReport,
} from "../data/report";
import { CurrentDateReport } from "../models/current-date-report.model";
import { CategoryReport } from "../models/category-report.model";
import { AccountReport } from "../models/account-report.model";
import { PeriodReport } from "../models/period-report.model";

@Injectable()
export class ReportService extends ReportData {
  private static BaseUrl = `${environment.base_url}/reports`;

  constructor(private http: HttpService) {
    super();
  }

  getCurrentDateReport(): Promise<CurrentDateReport> {
    const url = `${ReportService.BaseUrl}/current-date`;

    return this.http
      .get<ICurrentDateReport>(url)
      .pipe(map((r) => CurrentDateReport.fromDto(r)))
      .toPromise();
  }

  getCategoryReport(categoryId: number, start: Date, end: Date): Promise<CategoryReport> {
    const url = `${ReportService.BaseUrl}/category/${categoryId}`;

    return this.http
      .get<ICategoryReport>(url, {
        start: start.toDateString(),
        end: end.toDateString(),
      })
      .pipe(map((r) => CategoryReport.fromDto(r)))
      .toPromise();
  }

  getAccountReport(accountId: number, start: Date, end: Date): Promise<AccountReport> {
    const url = `${ReportService.BaseUrl}/account/${accountId}`;

    return this.http
      .get<IAccountReport>(url, {
        start: start.toDateString(),
        end: end.toDateString(),
      })
      .pipe(map((r) => AccountReport.fromDto(r)))
      .toPromise();
  }

  getPeriodReport(start: Date, end: Date, categoryIds: Array<number>): Promise<PeriodReport> {
    const url = `${ReportService.BaseUrl}`;

    return this.http
      .post<IPeriodReport>(url, null, {
        start: start.toDateString(),
        end: end.toDateString(),
        categoryIds: categoryIds,
      })
      .pipe(map((r) => PeriodReport.fromDto(r)))
      .toPromise();
  }
}
