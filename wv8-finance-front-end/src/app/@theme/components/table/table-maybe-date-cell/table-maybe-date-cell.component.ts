import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
import { Maybe } from '@wv8/typescript.core';

@Component({
  selector: "table-date-cell",
  templateUrl: "./table-maybe-date-cell.component.html",
  styleUrls: ["./table-maybe-date-cell.component.scss"]
})
export class TableMaybeDateCellComponent implements OnInit, ViewCell {
  @Input()
  value: any;
  @Input()
  rowData: any;

  typedValue: Maybe<Date>;

  constructor() {}

  ngOnInit() {
    this.typedValue = this.value;
  }
}
