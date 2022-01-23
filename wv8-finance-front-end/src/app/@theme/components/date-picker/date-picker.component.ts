import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import {
  NbRangepickerComponent,
  NbDatepicker,
  NbDateService
} from "@nebular/theme";

@Component({
  selector: "date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.scss"]
})
export class DatePickerComponent implements OnInit, OnChanges {
  @ViewChild("datePicker", { static: true })
  datePicker: NbDatepicker<Date>;
  @ViewChild("datePickerInput", { static: true })
  datePickerInput: ElementRef<HTMLInputElement>;

  @Input()
  disabled: boolean = false;
  @Input()
  setInitialValue: boolean = true;
  @Input()
  textAlign: "left" | "center" | "right" = "left";
  @Input()
  fieldSize: "small" | "normal" = "small";

  @Input()
  date: Date = undefined;
  @Output()
  dateChange = new EventEmitter<Date>();

  constructor(private dateService: NbDateService<Date>) {}

  ngOnInit() {
    if (!this.setInitialValue) return;

    if (!this.date) {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      this.date = today;
    }

    this.setDate(this.date);
  }

  ngOnChanges(): void {
    this.setDate(this.date);
  }

  setDate(date: Date) {
    this.date = date;
    this.datePicker.value = this.date;
    this.datePickerInput.nativeElement.value = `${this.dateService.format(
      this.date,
      "d MMM yy"
    )}`;
  }

  onDateChange(event: Date) {
    this.dateChange.emit(event);
  }
}
