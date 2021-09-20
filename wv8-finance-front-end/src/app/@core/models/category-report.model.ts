import { Maybe } from "@wv8/typescript.core";
import { ICategoryReport } from "../data/report";
import { ReportIntervalUnit } from "../enums/report-interval-unit.enum";
import { Report } from "./report.model";

export class CategoryReport extends Report {
  dates: Date[];
  unit: ReportIntervalUnit;
  expenses: number[];
  incomes: number[];
  results: Maybe<number[]>;

  public static fromDto(dto: ICategoryReport): CategoryReport {
    let instance = new CategoryReport();

    instance.dates = dto.dates.map((d) => new Date(d));
    instance.unit = dto.unit;
    instance.expenses = dto.expenses;
    instance.incomes = dto.incomes;
    instance.results = Maybe.deserialize(dto.results);

    return instance;
  }
}
