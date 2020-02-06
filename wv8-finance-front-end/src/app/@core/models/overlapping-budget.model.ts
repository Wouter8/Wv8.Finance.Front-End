import { Budget } from './budget.model';
import { OverlappingType } from '../enums/overlapping-type';
import { IOverlappingBudget } from '../data/overlapping-budget';

export class OverlappingBudget {
  public budget: Budget;
  public overlappingType: OverlappingType;
  public overlappingPercentage: number;
  public fromRecurring: boolean;

  public static fromDto(dto: IOverlappingBudget): OverlappingBudget {
    let instance = new OverlappingBudget();

    instance.budget = Budget.fromDto(dto.budget);
    instance.overlappingType = dto.overlappingType;
    instance.overlappingPercentage = dto.overlappingPercentage;
    instance.fromRecurring = dto.fromRecurring;

    return instance;
  }
}