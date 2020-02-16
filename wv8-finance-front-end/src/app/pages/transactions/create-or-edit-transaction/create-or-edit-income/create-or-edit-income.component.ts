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
import { CategoryType } from "../../../../@core/enums/category-type";
import { NbDatepicker, NbDateService } from "@nebular/theme";

@Component({
  selector: "create-or-edit-income",
  templateUrl: "./create-or-edit-income.component.html",
  styleUrls: ["./create-or-edit-income.component.scss"]
})
export class CreateOrEditIncomeComponent implements OnInit, OnChanges {
  @ViewChild("datePicker", { static: true })
  datePicker: NbDatepicker<Date>;
  @ViewChild("datePickerInput", { static: true })
  datePickerInput: ElementRef<HTMLInputElement>;

  @Input() transaction: Transaction;
  @Input() editing: boolean;
  @Input() date: Date;

  types = CategoryType;

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
    this.transaction.date = new Date(date.toISOString());
  }

  setCategoryId(id: number) {
    this.transaction.categoryId = new Maybe(id);
  }
}
