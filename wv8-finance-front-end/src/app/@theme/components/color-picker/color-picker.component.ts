import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'wv8-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  @Input()
  color: string;

  @Input()
  onColorChange = (color: string) => null;

  colors: string[] = [
    "#0049E4",
    "#00177F",
    "#2E00C8",
    "#A202F7",
    "#DC0000",
    "#E88D00",
    "#5A3700",
    "#F3FF00",
    "#51FF00",
    "#008514",
    "#008551",
  ];

  onSelectionChange(color: string) {
    this.color = color;
    this.onColorChange(color);
  }

  constructor() { }

  ngOnInit() {
  }

}
