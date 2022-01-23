import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef } from "@angular/core";
import { Transaction } from "../../../../@core/models/transaction.model";
import { Maybe } from "@wv8/typescript.core";

@Component({
  selector: "create-or-edit-income",
  templateUrl: "./create-or-edit-income.component.html",
  styleUrls: ["./create-or-edit-income.component.scss"],
})
export class CreateOrEditIncomeComponent implements OnInit {
  @Input() transaction: Transaction;
  @Input() editing: boolean;

  warningMessage: Maybe<string> = Maybe.none();

  constructor() {}

  ngOnInit() {
    if (!this.transaction.fullyEditable) {
      this.warningMessage = Maybe.some(
        "Only the category of this transaction is editable.\nUpdate the other properties in Splitwise."
      );
    }
  }

  dateChanged(date: Date) {
    this.transaction.date = new Date(date);
  }

  setCategoryId(id: number) {
    this.transaction.categoryId = new Maybe(id);
  }
}
