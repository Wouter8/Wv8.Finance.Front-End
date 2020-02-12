import { IBudget } from "../data/budget";
import { TransactionType } from "../enums/transaction-type.enum";
import { Category } from "./category.model";

export class Budget {
  id: number;
  amount: number;
  description: string;
  categoryId: number;
  category: Category;
  startDate: Date;
  endDate: Date;
  spent: number;
  spentPercentage: number;

  public static fromDto(dto: IBudget): Budget {
    let instance = new Budget();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.amount = dto.amount;
    instance.categoryId = dto.categoryId;
    instance.category = Category.fromDto(dto.category);
    instance.startDate = new Date(dto.startDate);
    instance.endDate = new Date(dto.endDate);
    instance.spent = dto.spent;
    instance.spentPercentage = (instance.spent / instance.amount) * 100;

    return instance;
  }

  public copy(): Budget {
    return Budget.fromDto({
      id: this.id,
      description: this.description,
      amount: this.amount,
      categoryId: this.categoryId,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      spent: this.spent,
      category: this.category.copy()
    });
  }
}
