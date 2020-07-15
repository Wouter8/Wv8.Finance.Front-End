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
import { NbDatepicker, NbDateService, NbCalendarRange } from "@nebular/theme";
import { Maybe } from "@wv8/typescript.core";
import { RecurringTransaction } from "../../../../../@core/models/recurring-transaction.model";
import { IntervalUnit } from "../../../../../@core/enums/interval-unit";

@Component({
  selector: "create-or-edit-recurring-internal",
  templateUrl: "./create-or-edit-recurring-internal.component.html",
  styleUrls: ["./create-or-edit-recurring-internal.component.scss"]
})
export class CreateOrEditRecurringInternalComponent implements OnInit {
  @Input() recurringTransaction: RecurringTransaction;
  @Input() editing: boolean;

  @Input() updateInstances: boolean;
  @Output() updateInstancesChange = new EventEmitter<boolean>();

  intervalUnits = IntervalUnit;

  constructor() {}

  ngOnInit() {}

  periodChanged(period: NbCalendarRange<Date>) {
    this.recurringTransaction.startDate = new Date(period.start);
    this.recurringTransaction.endDate = new Maybe(period.end).map(s => new Date(s));
  }

  setReceivingAccountId(id: number) {
    this.recurringTransaction.receivingAccountId = new Maybe(id);
  }

  onUpdateInstanceChange(val: boolean) {
    this.updateInstancesChange.emit(val);
  }
}
