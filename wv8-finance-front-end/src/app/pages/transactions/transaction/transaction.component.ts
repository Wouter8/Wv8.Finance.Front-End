import { Component, OnInit } from "@angular/core";
import { Transaction } from "../../../@core/models/transaction.model";
import { ActivatedRoute, Router } from "@angular/router";
import { TransactionData } from "../../../@core/data/transaction";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { Maybe } from "@wv8/typescript.core";
import { ConfirmDialogComponent } from "../../../@theme/components/confirm-dialog/confirm-dialog.component";
import { ConfirmTransactionComponent } from "../confirm-transaction/confirm-transaction.component";
import { CreateOrEditTransactionComponent } from "../../../@theme/components/create-or-edit-transaction/create-or-edit-transaction.component";

@Component({
  selector: "transaction",
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.scss"],
})
export class TransactionComponent implements OnInit {
  transaction: Transaction;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionData,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      let id = new Maybe<number>(params.id);
      if (id.isSome) {
        try {
          this.transaction = await this.transactionService.getTransaction(id.value);
        } catch {
          this.toasterService.danger("", "transaction not found");
          this.router.navigateByUrl("/transactions");
        }
      }
    });
  }

  async onDeleteClick() {
    this.dialogService
      .open(ConfirmDialogComponent, {
        context: { body: `Delete transaction?` },
      })
      .onClose.subscribe(async (confirmed: boolean) => {
        if (confirmed) {
          await this.transactionService.deleteTransaction(this.transaction.id);

          this.toasterService.success("", "Deleted transaction");
          this.router.navigateByUrl("/transactions");
        }
      });
  }

  async onConfirmClick() {
    this.dialogService
      .open(ConfirmTransactionComponent, {
        context: { transaction: this.transaction.copy() },
      })
      .onClose.subscribe((data: { success: boolean; transaction: Transaction }) => {
        if (data.success) {
          this.transaction = data.transaction;

          this.toasterService.success("", "Confirmed transaction");
        }
      });
  }

  onEditClick() {
    this.dialogService
      .open(CreateOrEditTransactionComponent, {
        context: { transaction: this.transaction.copy() },
      })
      .onClose.subscribe((data?: { success: boolean; transaction: Transaction }) => {
        if (data?.success) {
          this.transaction = data.transaction;

          this.toasterService.success("", "Updated transaction");
        }
      });
  }
}
