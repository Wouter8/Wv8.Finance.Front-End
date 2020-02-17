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
export class CreateOrEditTransferComponent implements OnInit {
  @Input() transaction: Transaction;
  @Input() editing: boolean;

  constructor() {}

  ngOnInit() {}

  dateChanged(date: Date) {
    this.transaction.date = new Date(date);
  }

  setReceivingAccountId(id: number) {
    this.transaction.receivingAccountId = new Maybe(id);
  }
}
