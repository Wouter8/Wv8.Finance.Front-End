import { Maybe } from "@wv8/typescript.core";
import { IPeriodReport, ITransactionSums } from "../data/report";
import { ReportIntervalUnit } from "../enums/report-interval-unit.enum";
import { MapUtils } from "../utils/map-utils";
import { Category } from "./category.model";
import { Report } from "./report.model";

export class PeriodReport extends Report {
  dailyNetWorth: Map<Date, number>;
  totals: ITransactionSums;
  totalsPerRootCategory: Map<number, ITransactionSums>;
  totalsPerChildCategory: Map<number, Map<number, ITransactionSums>>;
  sumsPerInterval: ITransactionSums[];
  categories: Map<number, Category>;

  public static fromDto(dto: IPeriodReport): PeriodReport {
    let instance = new PeriodReport();

    instance.dates = dto.dates.map((d) => new Date(d));
    instance.unit = dto.unit;
    instance.dailyNetWorth = MapUtils.dictToMap(dto.dailyNetWorth, (d) => new Date(d));
    instance.totals = dto.totals;
    instance.totalsPerRootCategory = MapUtils.dictToMap(dto.totalsPerRootCategory);
    instance.totalsPerChildCategory = MapUtils.dictToMap(dto.totalsPerChildCategory, null, (m2) =>
      MapUtils.dictToMap(m2)
    );
    instance.sumsPerInterval = dto.sumsPerInterval;
    instance.categories = MapUtils.dictToMap(dto.categories, null, (c) => Category.fromDto(c));

    console.log(instance);
    return instance;
  }
}
