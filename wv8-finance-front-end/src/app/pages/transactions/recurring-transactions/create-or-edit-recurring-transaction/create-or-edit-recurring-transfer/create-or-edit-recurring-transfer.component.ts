import {
  Component,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { NbDatepicker, NbDateService } from "@nebular/theme";
import { Maybe } from "wv8.typescript.core";
import { RecurringTransaction } from "../../../../../@core/models/recurring-transaction.model";
import { IntervalUnit } from "../../../../../@core/enums/interval-unit";

@Component({
  selector: "create-or-edit-recurring-transfer",
  templateUrl: "./create-or-edit-recurring-transfer.component.html",
  styleUrls: ["./create-or-edit-recurring-transfer.component.scss"]
})
export class CreateOrEditRecurringTransferComponent implements OnInit {
  @Input() recurringTransaction: RecurringTransaction;
  @Input() editing: boolean;

  @Input() updateInstances: boolean;
  @Output() updateInstancesChange = new EventEmitter<boolean>();

  intervalUnits = IntervalUnit;

  constructor() {}

  ngOnInit() {}

  startDateChanged(date: Date) {
    this.recurringTransaction.startDate = new Date(date);
  }

  endDateChanged(date: Date) {
    this.recurringTransaction.endDate = new Date(date);
  }

  setReceivingAccountId(id: number) {
    this.recurringTransaction.receivingAccountId = new Maybe(id);
  }
}
