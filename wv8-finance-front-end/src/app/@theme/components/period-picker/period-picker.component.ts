import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import {
  NbRangepickerComponent,
  NbDateService,
  NbCalendarRange,
  NbCalendarRangeComponent
} from "@nebular/theme";

@Component({
  selector: "period-picker",
  templateUrl: "./period-picker.component.html",
  styleUrls: ["./period-picker.component.scss"]
})
export class PeriodPickerComponent implements OnInit {
  @ViewChild("periodPicker", { static: true })
  periodPicker: NbRangepickerComponent<Date>;
  @ViewChild("periodPickerInput", { static: true })
  periodPickerInput: ElementRef<HTMLInputElement>;

  @Input()
  start: Date = undefined;
  @Input()
  end: Date = undefined;
  @Input()
  disabled: boolean = false;
  @Input()
  setInitialValue: boolean = true;
  @Input()
  textAlign: "left" | "center" | "right" = "left";
  @Input()
  fieldSize: "small" | "normal" = "small";

  @Output()
  periodChanged = new EventEmitter<NbCalendarRange<Date>>();

  range: NbCalendarRange<Date> = undefined;

  constructor(private dateService: NbDateService<Date>) {}

  ngOnInit() {
    if (!this.setInitialValue) return;

    if (this.start && this.end) {
      this.range = {
        start: this.start,
        end: this.end
      };
    } else {
      let today = new Date();
      this.range = {
        start: this.dateService.getMonthStart(today),
        end: this.dateService.getMonthEnd(today)
      };
    }

    this.periodPicker.range = this.range;
    this.periodPickerInput.nativeElement.value = `${this.dateService.format(
      this.range.start,
      "d MMM yy"
    )} - ${this.dateService.format(this.range.end, "d MMM yy")}`;

    this.onSetPeriod(this.range);
  }

  onSetPeriod(event: NbCalendarRange<Date>) {
    if (event.start && event.end) {
      this.range = event;
      this.periodChanged.emit(this.range);
    }
  }
}
