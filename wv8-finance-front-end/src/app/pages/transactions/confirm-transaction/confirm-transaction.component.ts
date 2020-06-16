import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef, NbToastrService, NbDateService } from "@nebular/theme";
import { TransactionData } from "../../../@core/data/transaction";
import { Transaction } from "../../../@core/models/transaction.model";
import { TransactionType } from "../../../@core/enums/transaction-type.enum";

@Component({
  selector: "confirm-transaction",
  templateUrl: "./confirm-transaction.component.html",
  styleUrls: ["./confirm-transaction.component.scss"],
})
export class ConfirmTransactionComponent implements OnInit {
  @Input()
  transaction: Transaction;

  constructor(
    protected dialogRef: NbDialogRef<ConfirmTransactionComponent>,
    private transactionService: TransactionData,
    private toasterService: NbToastrService,
    private dateService: NbDateService<Date>
  ) {}

  ngOnInit() {}

  cancel() {
    this.dialogRef.close({ success: false });
  }

  async submit() {
    let errors = this.validate().reverse();
    if (errors.length > 0) {
      errors.map((e) => this.toasterService.warning(e, "Incorrect data"));
      return;
    }

    this.transaction = await this.transactionService.confirmTransaction(
      this.transaction.id,
      this.transaction.date,
      this.transaction.amount
    );
    this.dialogRef.close({ success: true, transaction: this.transaction });
  }

  private validate() {
    let messages: string[] = [];

    if (!this.transaction.amount || this.transaction.amount <= 0)
      messages.push("Amount must be greater than 0.");

    return messages;
  }

  dateChanged(date: Date) {
    this.transaction.date = new Date(date);
  }
}
