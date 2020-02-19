import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";

@Component({
  selector: "table-date-cell",
  templateUrl: "./table-date-cell.component.html",
  styleUrls: ["./table-date-cell.component.scss"]
})
export class TableDateCellComponent implements OnInit, ViewCell {
  @Input()
  value: any;
  @Input()
  rowData: any;

  @Input()
  determineIsFuture: () => boolean;
  @Input()
  showFutureIcon: boolean = false;
  @Input()
  futureTooltipText: string = "Future";

  isFuture: boolean = false;

  constructor() {}

  ngOnInit() {
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    this.isFuture = this.determineIsFuture
      ? this.determineIsFuture()
      : this.value > now;
  }
}
