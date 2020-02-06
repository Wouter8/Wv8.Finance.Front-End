import { IBudget } from './budget';
import { OverlappingType } from '../enums/overlapping-type';

export interface IOverlappingBudget {
    budget: IBudget;
    overlappingType: OverlappingType;
    overlappingPercentage: number;
    fromRecurring: boolean;
}