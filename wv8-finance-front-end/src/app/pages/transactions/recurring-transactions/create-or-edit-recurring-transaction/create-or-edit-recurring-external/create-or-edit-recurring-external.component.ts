import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { Maybe } from "@wv8/typescript.core";
import { NbDatepicker, NbDateService, NbCalendarRange } from "@nebular/theme";
import { RecurringTransaction } from "../../../../../@core/models/recurring-transaction.model";
import { IntervalUnit } from "../../../../../@core/enums/interval-unit";

@Component({
  selector: "create-or-edit-recurring-external",
  templateUrl: "./create-or-edit-recurring-external.component.html",
  styleUrls: ["./create-or-edit-recurring-external.component.scss"]
})
export class CreateOrEditRecurringExternalComponent implements OnInit {
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

  setCategoryId(id: number) {
    this.recurringTransaction.categoryId = new Maybe(id);
  }

  onUpdateInstanceChange(val: boolean) {
    this.updateInstancesChange.emit(val);
  }
}
