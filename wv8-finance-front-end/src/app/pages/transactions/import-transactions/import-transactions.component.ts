import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { Maybe } from "@wv8/typescript.core";
import {
  ISplitwiseData,
  ISplitwiseTransaction,
} from "../../../@core/data/splitwise";
import { ImportState } from "../../../@core/enums/import-state.enum";
import { ImporterInformation } from "../../../@core/models/importer-information.model";
import { SplitwiseTransaction } from "../../../@core/models/splitwise-transaction.model";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { DatePipe } from "@angular/common";
import { ImportResult } from "../../../@core/enums/import-result.enum";

TimeAgo.addDefaultLocale(en);

@Component({
  selector: "import-transactions",
  templateUrl: "./import-transactions.component.html",
  styleUrls: ["./import-transactions.component.scss"],
})
export class ImportTransactionsComponent implements OnInit {
  rows: ISplitwiseTransactionRow[] = [];

  importerInformation: ImporterInformation;

  importStates = ImportState;

  timeAgo: any;

  importFinishedTimer: NodeJS.Timeout;

  constructor(
    private splitwiseService: ISplitwiseData,
    private toaster: NbToastrService,
    private datePipie: DatePipe
  ) {
    this.timeAgo = new TimeAgo("en");
  }

  async ngOnInit() {
    await this.checkImporterFinished();

    if (this.importerInformation.currentState === ImportState.Running) {
      this.importFinishedTimer = setInterval(
        this.checkImporterFinished.bind(this),
        1000
      );
    }
  }

  private async checkImporterFinished() {
    this.importerInformation = await this.splitwiseService.getImporterInformation();
    if (this.importerInformation.currentState === ImportState.NotRunning) {
      await this.loadTransactions();
      clearInterval(this.importFinishedTimer);
    }
  }

  getTimestampString(): string {
    return this.datePipie.transform(
      this.importerInformation.lastRunTimestamp,
      "dd-MM-yyyy HH:mm:ss"
    );
  }

  getRunTimeString(): string {
    return this.timeAgo.format(this.importerInformation.lastRunTimestamp);
  }

  setCategoryId(row: ISplitwiseTransactionRow, categoryId: number) {
    row.categoryId = new Maybe(categoryId);
  }

  setAccountId(row: ISplitwiseTransactionRow, accountId: number) {
    row.accountId = new Maybe(accountId);
  }

  async importTransaction(row: ISplitwiseTransactionRow) {
    if (!row.isSettlement && row.categoryId.isNone)
      this.toaster.warning("", "Specify a category for the transaction.");
    if (row.isSettlement && row.accountId.isNone)
      this.toaster.warning("", "Specify an account for the transaction.");

    if (row.imported)
      this.toaster.danger("", "This transaction was already imported.");

    var transaction = row.isSettlement
      ? await this.splitwiseService.completeTransferImport(
        row.transaction.id,
        row.accountId.value
      )
      : await this.splitwiseService.completeTransactionImport(
        row.transaction.id,
        row.categoryId.value,
        row.accountId
      );

    row.imported = true;

    this.toaster.success("", "Transaction imported.");
  }

  async importFromSplitwise() {
    this.importerInformation.currentState = ImportState.Running;

    try {
      var result = await this.splitwiseService.importFromSplitwise();

      if (result === ImportResult.Completed) {
        await this.loadTransactions();

        this.toaster.success("", "Importer ran successfully");

        this.importerInformation.lastRunTimestamp = new Date();
      }
    } catch {
      this.toaster.success("", "Importer failed");
    } finally {
      this.importerInformation.currentState = ImportState.NotRunning;
    }
  }

  private async loadTransactions() {
    var transactionsToImport = await this.splitwiseService.getSplitwiseTransactions(
      true
    );
    var existingIds = this.rows.map((r) => r.transaction.id);
    var newTransactions = transactionsToImport.filter(
      (t) => existingIds.indexOf(t.id) === -1
    );

    this.rows = this.rows.concat(
      newTransactions.map((t) => this.splitwiseTransactionToRow(t))
    );
  }

  private splitwiseTransactionToRow(
    transaction: SplitwiseTransaction
  ): ISplitwiseTransactionRow {
    return {
      transaction: transaction,
      isSettlement: transaction.description == "Payment",
      categoryId: Maybe.none(),
      accountId: Maybe.none(),
      imported: false,
    };
  }
}

interface ISplitwiseTransactionRow {
  transaction: SplitwiseTransaction;
  isSettlement: boolean;
  categoryId: Maybe<number>;
  accountId: Maybe<number>;
  imported: boolean;
}
