import { ITransactionGroup, ITransaction } from "../data/transaction";
import { Category } from "./category.model";
import { Transaction } from "./transaction.model";
import { TransactionType } from "../enums/transaction-type.enum";
import { ICategory } from "../data/category";

export class TransactionGroup {
  totalSearchResults: number;
  totalSum: number;
  sumPerCategory: Map<Category, number>;
  transactionsPerCategory: Map<Category, Transaction[]>;
  transactionsPerType: Map<TransactionType, Transaction[]>;
  transactions: Transaction[];
  categories: Map<number, Category>;

  public static fromDto(dto: ITransactionGroup): TransactionGroup {
    let instance = new TransactionGroup();

    instance.transactions = dto.transactions.map(t => Transaction.fromDto(t));
    instance.totalSum = dto.totalSum;
    instance.totalSearchResults = dto.totalSearchResults;

    instance.categories = new Map();
    instance.sumPerCategory = new Map();
    instance.transactionsPerCategory = new Map();
    instance.transactionsPerType = new Map();

    for (let key in dto.categories) {
      let id = +key;
      let category = Category.fromDto(dto.categories[key]);
      instance.categories.set(id, category);
    }
    for (let key in dto.sumPerCategory) {
      let categoryId = +key;
      let value = dto.sumPerCategory[key];
      instance.sumPerCategory.set(
        instance.categories[categoryId],
        value
      );
    }
    for (let key in dto.transactionsPerCategory) {
      let categoryId = +key;
      let value: ITransaction[] = dto.transactionsPerCategory[key];
      instance.transactionsPerCategory.set(
        instance.categories[categoryId],
        value.map(t => Transaction.fromDto(t))
      );
    }
    for (let key in dto.transactionsPerType) {
      let type = TransactionType[key];
      let value = dto.transactionsPerType[key];
      instance.transactionsPerType.set(
        type,
        value.map(t => Transaction.fromDto(t))
      );
    }
    return instance;
  }
}
