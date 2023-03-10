import { Component, OnInit } from "@angular/core";
import { ViewCell } from "angular2-smart-table";

@Component({
  selector: "table-icon-cell",
  templateUrl: "./table-icon-cell.component.html",
  styleUrls: ["./table-icon-cell.component.scss"],
})
export class TableIconCellComponent implements OnInit, ViewCell {
  value: any;
  rowData: any;

  constructor() {}

  ngOnInit() {}
}
