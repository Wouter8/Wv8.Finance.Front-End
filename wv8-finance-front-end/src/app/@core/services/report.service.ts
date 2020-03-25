import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IAccount, AccountData } from "../data/account";
import { Account } from "../models/account.model";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { HttpService } from "../utils/http.service";
import { ReportData, ICurrentDateReport } from "../data/report";
import { CurrentDateReport } from "../models/current-date-report.model";

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
      .pipe(map(r => CurrentDateReport.fromDto(r)))
      .toPromise();
  }
}
