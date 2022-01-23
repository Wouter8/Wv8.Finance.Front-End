import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { Maybe } from "@wv8/typescript.core";
import { ConfirmDialogComponent } from "../../../../@theme/components/confirm-dialog/confirm-dialog.component";
import { CreateOrEditRecurringTransactionComponent } from "../create-or-edit-recurring-transaction/create-or-edit-recurring-transaction.component";
import { RecurringTransaction } from "../../../../@core/models/recurring-transaction.model";
import { RecurringTransactionData } from "../../../../@core/data/recurring-transaction";
import { DeleteRecurringTransactionComponent } from "../delete-recurring-transaction/delete-recurring-transaction.component";

@Component({
  selector: "recurring-transaction",
  templateUrl: "./recurring-transaction.component.html",
  styleUrls: ["./recurring-transaction.component.scss"]
})
export class RecurringTransactionComponent implements OnInit {
  recurringTransaction: RecurringTransaction;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recurringTransactionService: RecurringTransactionData,
    private dialogService: NbDialogService,
    private toasterService: NbToastrService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      let id = new Maybe<number>(params.id);
      if (id.isSome) {
        try {
          this.recurringTransaction = await this.recurringTransactionService.getRecurringTransaction(
            id.value
          );
        } catch {
          this.toasterService.danger("", "Recurring transaction not found");
          this.router.navigateByUrl("/transactions/recurring");
        }
      }
    });
  }

  async onDeleteClick() {
    this.dialogService
      .open(DeleteRecurringTransactionComponent)
      .onClose.subscribe(
        async (data: { confirmed: boolean; deleteInstances: boolean }) => {
          if (data.confirmed) {
            await this.recurringTransactionService.deleteRecurringTransaction(
              this.recurringTransaction.id,
              data.deleteInstances
            );

            this.toasterService.success("", "Deleted recurring transaction");
            this.router.navigateByUrl("/transactions/recurring");
          }
        }
      );
  }

  onEditClick() {
    this.dialogService
      .open(CreateOrEditRecurringTransactionComponent, {
        context: {
          recurringTransaction: this.recurringTransaction.copy()
        }
      })
      .onClose.subscribe(
        (data: {
          success: boolean;
          recurringTransaction: RecurringTransaction;
        }) => {
          if (data.success) {
            this.recurringTransaction = data.recurringTransaction;

            this.toasterService.success("", "Updated recurring transaction");
          }
        }
      );
  }
}
