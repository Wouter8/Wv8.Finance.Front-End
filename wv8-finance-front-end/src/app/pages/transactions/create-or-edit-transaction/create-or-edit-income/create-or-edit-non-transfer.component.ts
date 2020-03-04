import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Transaction } from "../../../../@core/models/transaction.model";
import { Maybe } from "@wv8/typescript.core";
import { CategoryType } from "../../../../@core/enums/category-type";
import { NbDatepicker, NbDateService } from "@nebular/theme";

@Component({
  selector: "create-or-edit-non-transfer",
  templateUrl: "./create-or-edit-non-transfer.component.html",
  styleUrls: ["./create-or-edit-non-transfer.component.scss"]
})
export class CreateOrEditNonTransferComponent implements OnInit {
  @Input() transaction: Transaction;
  @Input() editing: boolean;
  @Input() categoryType: CategoryType;

  constructor() {}

  ngOnInit() {}

  dateChanged(date: Date) {
    this.transaction.date = new Date(date);
  }

  setCategoryId(id: number) {
    this.transaction.categoryId = new Maybe(id);
  }
}
