import { Category } from "./category.model";
import { IntervalUnit } from "../enums/interval-unit";
import { Maybe } from "wv8.typescript.core";
import { IRecurringBudget } from '../data/recurring-budget';

export class RecurringBudget {
  id: number;
  name: string = "";
  amount: number;
  categoryId: number;
  category: Category;
  startDate: Date;
  endDate: Maybe<Date>;
  interval: number;
  intervalUnit: IntervalUnit;

  public static fromDto(dto: IRecurringBudget): RecurringBudget {
    let instance = new RecurringBudget();

    instance.id = dto.id;
    instance.name = dto.name;
    instance.amount = dto.amount;
    instance.categoryId = dto.categoryId;
    instance.startDate = new Date(dto.startDate);
    instance.endDate = Maybe.deserialize(dto.endDate).map(
      endDate => new Date(endDate)
    );
    instance.interval = dto.interval;
    instance.intervalUnit = dto.intervalUnit;

    return instance;
  }

  public copy(): RecurringBudget {
    return RecurringBudget.fromDto(this.serialize());
  }

  public serialize(): IRecurringBudget {
    let dto: IRecurringBudget = {
      id: this.id,
      name: this.name,
      amount: this.amount,
      categoryId: this.categoryId,
      category: this.category.serialize(),
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.map(date => date.toISOString()).serialize(),
      interval: this.interval,
      intervalUnit: this.intervalUnit,
    };

    return dto;
  }
}
