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
export class CreateOrEditExpenseComponent implements OnInit, OnChanges {
  @ViewChild("datePicker", { static: true })
  datePicker: NbDatepicker<Date>;
  @ViewChild("datePickerInput", { static: true })
  datePickerInput: ElementRef<HTMLInputElement>;

  @Input() transaction: Transaction;
  @Input() editing: boolean;
  @Input() date: Date;

  constructor(private dateService: NbDateService<Date>) {}

  ngOnInit() {}

  ngOnChanges() {
    this.datePicker.value = this.transaction.date;
    this.datePickerInput.nativeElement.value = `${this.dateService.format(
      this.transaction.date,
      "d MMM yy"
    )}`;
  }

  dateChanged(date: Date) {
    this.transaction.date.setDate(date.getDate());
  }

  setCategoryId(id: number) {
    this.transaction.categoryId = new Maybe(id);
  }
}
