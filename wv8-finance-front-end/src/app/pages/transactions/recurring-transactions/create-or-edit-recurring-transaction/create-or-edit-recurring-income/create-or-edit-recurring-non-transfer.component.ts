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
import { CategoryType } from "../../../../../@core/enums/category-type";
import { IntervalUnit } from "../../../../../@core/enums/interval-unit";

@Component({
  selector: "create-or-edit-recurring-non-transfer",
  templateUrl: "./create-or-edit-recurring-non-transfer.component.html",
  styleUrls: ["./create-or-edit-recurring-non-transfer.component.scss"]
})
export class CreateOrEditRecurringNonTransferComponent implements OnInit {
  @Input() recurringTransaction: RecurringTransaction;
  @Input() editing: boolean;
  @Input() categoryType: CategoryType;

  @Input() updateInstances: boolean;
  @Output() updateInstancesChange = new EventEmitter<boolean>();

  intervalUnits = IntervalUnit;

  constructor() {}

  ngOnInit() {}

  periodChanged(period: NbCalendarRange<Date>) {
    this.recurringTransaction.startDate = new Date(period.start);
    this.recurringTransaction.endDate = new Date(period.end);
  }

  setCategoryId(id: number) {
    this.recurringTransaction.categoryId = new Maybe(id);
  }

  onUpdateInstanceChange($event) {
    this.updateInstancesChange.emit();
  }
}
