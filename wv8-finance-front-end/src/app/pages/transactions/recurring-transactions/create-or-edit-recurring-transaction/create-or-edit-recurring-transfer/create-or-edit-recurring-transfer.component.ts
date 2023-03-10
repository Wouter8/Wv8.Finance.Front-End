import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";
import { NbDatepicker, NbDateService, NbCalendarRange } from "@nebular/theme";
import { Maybe } from "@wv8/typescript.core";
import { RecurringTransaction } from "../../../../../@core/models/recurring-transaction.model";
import { IntervalUnit } from "../../../../../@core/enums/interval-unit";
import { Account } from "../../../../../@core/models/account.model";

@Component({
  selector: "create-or-edit-recurring-transfer",
  templateUrl: "./create-or-edit-recurring-transfer.component.html",
  styleUrls: ["./create-or-edit-recurring-transfer.component.scss"],
})
export class CreateOrEditRecurringTransferComponent implements OnInit {
  @Input() recurringTransaction: RecurringTransaction;
  @Input() editing: boolean;
  @Input() accounts: Account[];

  @Input() updateInstances: boolean;
  @Output() updateInstancesChange = new EventEmitter<boolean>();

  intervalUnits = IntervalUnit;

  constructor() {}

  ngOnInit() {}

  periodChanged(period: NbCalendarRange<Date>) {
    this.recurringTransaction.startDate = new Date(period.start);
    this.recurringTransaction.endDate = new Maybe(period.end).map(s => new Date(s));
  }

  setAccount(account: Account[]) {
    this.recurringTransaction.account = account[0];
    this.recurringTransaction.accountId = account[0].id;
  }

  setReceiver(account: Account[]) {
    this.recurringTransaction.receivingAccount = new Maybe(account[0]);
    this.recurringTransaction.receivingAccountId = new Maybe(account[0].id);
  }

  public accountId = (a: Account) => a.id;
  public accountTitle = (a: Account) => a.description;
  public accountIcon = Maybe.some((a: Account) => a.icon);

  onUpdateInstanceChange(val: boolean) {
    this.updateInstancesChange.emit(val);
  }
}
