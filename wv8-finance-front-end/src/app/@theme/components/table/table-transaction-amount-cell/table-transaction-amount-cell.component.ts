import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
import { TransactionType } from "../../../../@core/enums/transaction-type.enum";
import { BaseTransaction } from "../../../../@core/models/base-transaction.model";
import { Transaction } from "../../../../@core/models/transaction.model";

@Component({
  selector: "table-transaction-amount-cell",
  templateUrl: "./table-transaction-amount-cell.component.html",
  styleUrls: ["./table-transaction-amount-cell.component.scss"],
})
export class TableTransactionAmountCellComponent implements OnInit, ViewCell {
  @Input()
  value: any;
  @Input()
  rowData: any;

  typedRowData: BaseTransaction;

  differentPersonalAmount: boolean;
  splitDetailsSum: number;
  paymentRequestsSum: number;

  constructor() {}

  ngOnInit() {
    this.typedRowData = this.rowData;

    console.log(this.typedRowData);

    this.differentPersonalAmount =
      this.typedRowData.type === TransactionType.Expense &&
      this.typedRowData.amount !== this.typedRowData.personalAmount;

    if (this.differentPersonalAmount) {
      this.splitDetailsSum = this.typedRowData.splitDetails.reduce(
        (prev, sd) => prev + sd.amount,
        0
      );
      this.paymentRequestsSum = this.typedRowData.paymentRequests.reduce(
        (prev, pr) => prev + pr.amount * pr.count,
        0
      );
    }
  }
}
