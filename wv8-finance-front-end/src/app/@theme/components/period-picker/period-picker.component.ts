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
  allowOnlyStart: boolean = false;
  @Input()
  disabled: boolean = false;
  @Input()
  setInitialValue: boolean = true;
  @Input()
  textAlign: "left" | "center" | "right" = "left";
  @Input()
  fieldSize: "small" | "normal" = "small";
  @Input()
  showClearButton: boolean = false;

  @Output()
  periodChanged = new EventEmitter<NbCalendarRange<Date>>();

  range: NbCalendarRange<Date> = undefined;

  constructor(private dateService: NbDateService<Date>) {}

  ngOnInit() {
    if (!this.setInitialValue) return;

    if (this.start) {
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
    this.onSetPeriod(this.range);
  }

  onSetPeriod(event: NbCalendarRange<Date>) {
    let inputText = "";
    if (event.start) {
      inputText += this.dateService.format(event.start, "d MMM yy");
    }
    if (event.end) {
      inputText += " - ";
      inputText += this.dateService.format(event.end, "d MMM yy");
    }
    setTimeout(() => {
      this.periodPickerInput.nativeElement.value = inputText;
    });

    var startSet = event.start != undefined && event.start != null;
    var endSet = event.end != undefined && event.end != null;
    var complete = (this.allowOnlyStart && startSet) || (startSet && endSet);

    if (complete) {
      this.range = event;
      this.periodChanged.emit(this.range);
    }
  }

  onClear() {
    this.range = { start: undefined, end: undefined };
    this.periodPicker.range = this.range;
    this.periodPickerInput.nativeElement.value = "";
    this.periodChanged.emit(this.range);
  }
}
