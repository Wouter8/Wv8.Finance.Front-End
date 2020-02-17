import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Transaction } from "../../../../@core/models/transaction.model";
import { Maybe } from "wv8.typescript.core";
import { NbDatepicker, NbDateService } from "@nebular/theme";

@Component({
  selector: "create-or-edit-expense",
  templateUrl: "./create-or-edit-expense.component.html",
  styleUrls: ["./create-or-edit-expense.component.scss"]
})
export class CreateOrEditExpenseComponent implements OnInit {
  @Input() transaction: Transaction;
  @Input() editing: boolean;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {}

  dateChanged(date: Date) {
    this.transaction.date = new Date(date);
  }

  setCategoryId(id: number) {
    this.transaction.categoryId = new Maybe(id);
  }
}
