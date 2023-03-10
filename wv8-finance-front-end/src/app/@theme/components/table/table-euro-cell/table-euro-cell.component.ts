import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "angular2-smart-table";

@Component({
  selector: "table-euro-cell",
  templateUrl: "./table-euro-cell.component.html",
  styleUrls: ["./table-euro-cell.component.scss"],
})
export class TableEuroCellComponent implements OnInit, ViewCell {
  @Input()
  value: any;
  @Input()
  rowData: any;

  constructor() {}

  ngOnInit() {}
}
