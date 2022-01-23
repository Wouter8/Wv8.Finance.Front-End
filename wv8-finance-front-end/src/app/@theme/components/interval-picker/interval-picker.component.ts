import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NbCalendarRange } from '@nebular/theme';
import { IntervalUnit } from '../../../@core/enums/interval-unit';

@Component({
  selector: 'interval-picker',
  templateUrl: './interval-picker.component.html',
  styleUrls: ['./interval-picker.component.scss']
})
export class IntervalPickerComponent implements OnInit {

  @Input() interval: number = 1;
  @Output() intervalChange = new EventEmitter<number>();

  @Input() intervalUnit: IntervalUnit = IntervalUnit.Months;
  @Output() intervalUnitChange = new EventEmitter<IntervalUnit>();

  constructor() { }

  ngOnInit() {
  }

}
