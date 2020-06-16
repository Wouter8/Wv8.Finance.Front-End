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
import { Maybe } from "@wv8/typescript.core";

@Component({
  selector: "create-or-edit-internal",
  templateUrl: "./create-or-edit-internal.component.html",
  styleUrls: ["./create-or-edit-internal.component.scss"]
})
export class CreateOrEditInternalComponent implements OnInit {
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
