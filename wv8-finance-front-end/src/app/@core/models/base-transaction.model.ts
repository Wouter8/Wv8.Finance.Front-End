import { Maybe } from "@wv8/typescript.core";
import { TransactionType } from "../enums/transaction-type.enum";
import { Category } from "./category.model";
import { SplitDetail } from "./split-detail.model";
import { PaymentRequest } from "./payment-request.model";
import { Account } from "./account.model";

export class BaseTransaction {
  id: number;
  description: string;
  type: TransactionType;
  amount: number;
  personalAmount: number;
  categoryId: Maybe<number> = Maybe.none();
  category: Maybe<Category> = Maybe.none();
  accountId: number;
  account: Account;
  receivingAccountId: Maybe<number> = Maybe.none();
  receivingAccount: Maybe<Account> = Maybe.none();
  needsConfirmation: boolean = false;
  paymentRequests: PaymentRequest[];
  splitDetails: SplitDetail[];
}
