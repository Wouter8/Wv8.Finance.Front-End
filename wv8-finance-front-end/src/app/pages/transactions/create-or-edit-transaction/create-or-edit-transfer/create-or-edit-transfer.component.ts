import {
  Component,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  Input
} from "@angular/core";
import { NbDatepicker, NbDateService } from "@nebular/theme";
import { Transaction } from "../../../../@core/models/transaction.model";
import { Maybe } from "wv8.typescript.core";
import { CategoryType } from "../../../../@core/enums/category-type";

@Component({
  selector: "create-or-edit-transfer",
  templateUrl: "./create-or-edit-transfer.component.html",
  styleUrls: ["./create-or-edit-transfer.component.scss"]
})
export class CreateOrEditTransferComponent implements OnInit, OnChanges {
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
    this.transaction.date = new Date(date.toISOString());
  }

  setReceivingAccountId(id: number) {
    this.transaction.categoryId = new Maybe(id);
  }
}
