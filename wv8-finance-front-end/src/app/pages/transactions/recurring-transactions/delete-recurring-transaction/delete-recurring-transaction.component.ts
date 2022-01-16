import { Component, OnInit, Input } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "delete-recurring-transaction",
  templateUrl: "./delete-recurring-transaction.component.html",
  styleUrls: ["./delete-recurring-transaction.component.scss"]
})
export class DeleteRecurringTransactionComponent implements OnInit {
  header: string = "Are you sure?";
  body: string;
  cancelText: string = "Cancel";
  submitText: string = "Submit";

  deleteInstances: boolean = false;

  constructor(
    protected ref: NbDialogRef<DeleteRecurringTransactionComponent>
  ) {}

  ngOnInit() {}

  close(confirmed: boolean) {
    this.ref.close({ confirmed, deleteInstances: this.deleteInstances });
  }
}
