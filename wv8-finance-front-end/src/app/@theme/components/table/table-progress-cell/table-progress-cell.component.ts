import { Component, OnInit } from "@angular/core";
import { ViewCell } from "angular2-smart-table";

@Component({
  selector: "table-progress-cell",
  templateUrl: "./table-progress-cell.component.html",
  styleUrls: ["./table-progress-cell.component.scss"],
})
export class TableProgressCellComponent implements OnInit, ViewCell {
  value: any;
  rowData: any;

  status: string;

  invertStatus: boolean = false;

  progressValue: number;

  constructor() {}

  ngOnInit() {
    this.status = this.invertStatus
      ? this.value < 25
        ? "success"
        : this.value < 75
        ? "warning"
        : "danger"
      : this.value < 25
      ? "danger"
      : this.value < 75
      ? "warning"
      : "success";

    this.progressValue = this.value >= 100 ? 100 : this.value;
  }
}
