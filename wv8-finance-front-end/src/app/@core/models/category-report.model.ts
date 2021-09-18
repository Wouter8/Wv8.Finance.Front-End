import { ICategoryReport } from "../data/report";
import { ReportIntervalUnit } from "../enums/report-interval-unit.enum";

export class CategoryReport {
  dates: Date[];
  unit: ReportIntervalUnit;
  expenses: number[];
  incomes: number[];
  results: number[];

  public static fromDto(dto: ICategoryReport): CategoryReport {
    let instance = new CategoryReport();

    instance.dates = dto.dates.map((d) => new Date(d));
    instance.unit = dto.unit;
    instance.expenses = dto.expenses;
    instance.incomes = dto.incomes;
    instance.results = dto.results;

    return instance;
  }
}
