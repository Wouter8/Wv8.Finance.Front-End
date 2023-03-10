import { Component, OnInit } from "@angular/core";
import { ViewCell } from "angular2-smart-table";

@Component({
  selector: "table-default-and-obsolete-cell",
  templateUrl: "./table-default-and-obsolete-cell.component.html",
  styleUrls: ["./table-default-and-obsolete-cell.component.scss"],
})
export class TableDefaultAndObsoleteCellComponent implements OnInit, ViewCell {
  value: any;
  rowData: any;

  constructor() {}

  ngOnInit() {}
}
