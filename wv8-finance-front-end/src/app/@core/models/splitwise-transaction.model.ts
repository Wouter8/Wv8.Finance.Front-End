import { ITransaction } from "../data/transaction";
import { TransactionType } from "../enums/transaction-type.enum";
import { Category } from "./category.model";
import { Maybe } from "@wv8/typescript.core";
import { Account } from "./account.model";
import { PaymentRequest } from "./payment-request.model";
import { RecurringTransaction } from "./recurring-transaction.model";
import { BaseTransaction } from "./base-transaction.model";
import { SplitDetail } from "./split-detail.model";
import { ISplitwiseTransaction } from "../data/splitwise";

export class SplitwiseTransaction {
  id: number;
  description: string;
  date: Date;
  isDeleted: boolean;
  imported: boolean;
  paidAmount: number;
  personalAmount: number;
  owedToOthers: number;
  owedByOthers: number;

  public static fromDto(dto: ISplitwiseTransaction): SplitwiseTransaction {
    let instance = new SplitwiseTransaction();

    instance.id = dto.id;
    instance.description = dto.description;
    instance.date = new Date(dto.date);
    instance.isDeleted = dto.isDeleted;
    instance.imported = dto.imported;
    instance.paidAmount = Math.abs(dto.paidAmount);
    instance.personalAmount = Math.abs(dto.personalAmount);
    instance.owedToOthers = Math.abs(dto.owedToOthers);
    instance.owedByOthers = Math.abs(dto.owedByOthers);

    return instance;
  }

  public copy(): SplitwiseTransaction {
    let instance = new SplitwiseTransaction();

    instance.id = this.id;
    instance.description = this.description;
    instance.date = new Date(this.date);
    instance.isDeleted = this.isDeleted;
    instance.imported = this.imported;
    instance.paidAmount = Math.abs(this.paidAmount);
    instance.personalAmount = Math.abs(this.personalAmount);
    instance.owedToOthers = Math.abs(this.owedToOthers);
    instance.owedByOthers = Math.abs(this.owedByOthers);

    return instance;
  }
}
