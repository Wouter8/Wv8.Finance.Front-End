import { Component, OnInit } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
import { TransactionType } from "../../../../@core/enums/transaction-type.enum";

@Component({
  selector: "table-transaction-type-icon-cell",
  templateUrl: "./table-transaction-type-icon-cell.component.html",
  styleUrls: ["./table-transaction-type-icon-cell.component.scss"]
})
export class TableTransactionTypeIconCellComponent implements OnInit, ViewCell {
  value: any;
  rowData: any;

  tooltipText: string = "";

  constructor() {}

  ngOnInit() {
    this.tooltipText = TransactionType.getTransactionTypeString(this.value);
  }
}
