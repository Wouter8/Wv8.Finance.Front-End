import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef } from "@angular/core";
import { Transaction } from "../../../../@core/models/transaction.model";
import { Maybe } from "@wv8/typescript.core";
import { Account } from "../../../../@core/models/account.model";
import { Category } from "../../../../@core/models/category.model";

@Component({
  selector: "create-or-edit-income",
  templateUrl: "./create-or-edit-income.component.html",
  styleUrls: ["./create-or-edit-income.component.scss"],
})
export class CreateOrEditIncomeComponent implements OnInit {
  @Input() transaction: Transaction;
  @Input() editing: boolean;
  @Input() accounts: Account[];
  @Input() categories: Category[];

  warningMessage: Maybe<string> = Maybe.none();

  constructor() {}

  ngOnInit() {
    if (!this.transaction.fullyEditable) {
      this.warningMessage = Maybe.some("Only the category of this transaction is editable.\nUpdate the other properties in Splitwise.");
    }
  }

  dateChanged(date: Date) {
    this.transaction.date = new Date(date);
  }

  setAccount(account: Account[]) {
    this.transaction.account = account[0];
    this.transaction.accountId = account[0].id;
  }

  setCategory(category: Category[]) {
    this.transaction.category = new Maybe(category[0]);
    this.transaction.categoryId = new Maybe(category[0].id);
  }

  public categoryId = (c: Category) => c.id;
  public categoryTitle = (c: Category) => c.description;
  public categoryIcon = Maybe.some((c: Category) => c.icon);
  public categoryChildren = Maybe.some((c: Category) => c.children);

  public accountId = (a: Account) => a.id;
  public accountTitle = (a: Account) => a.description;
  public accountIcon = Maybe.some((a: Account) => a.icon);
}
