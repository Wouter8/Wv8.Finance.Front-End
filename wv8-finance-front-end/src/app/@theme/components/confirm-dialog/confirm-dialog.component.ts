import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  @Input()
  header: string = "Are you sure?";

  @Input()
  body: string;

  @Input()
  cancelText: string = "Cancel";

  @Input()
  submitText: string = "Submit"

  constructor(protected ref: NbDialogRef<ConfirmDialogComponent>) { }

  ngOnInit() {
  }

  close(confirmed: boolean) {
    this.ref.close(confirmed);
  }

}
