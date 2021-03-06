import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { AccountData, IAccount } from "../../../@core/data/account";
import { Account } from "../../../@core/models/account.model";
import {
  NbDialogRef,
  NbToastrService,
  NbToastrConfig,
  NbDialogService,
  NbTrigger,
  NbPopoverDirective,
} from "@nebular/theme";
import { FontAwesomeIconPickerComponent } from "../../../@theme/components/font-awesome-icon-picker/font-awesome-icon-picker.component";
import { FontAwesomeIcon } from "../../../@theme/components/font-awesome-icon-picker/font-awesome-icon";
import { AccountType } from "../../../@core/enums/account-type.enum";

@Component({
  selector: "create-or-edit-account",
  templateUrl: "./create-or-edit-account.component.html",
  styleUrls: ["./create-or-edit-account.component.scss"],
})
export class CreateOrEditAccountComponent implements OnInit {
  @Input()
  account: Account;

  accountTypes = AccountType;

  editing = false;
  header: string = "Creating new account";

  @ViewChild(NbPopoverDirective)
  popover: NbPopoverDirective;
  iconPickerComponent = FontAwesomeIconPickerComponent;
  iconPickerContext: any;

  constructor(
    protected dialogRef: NbDialogRef<CreateOrEditAccountComponent>,
    private toasterService: NbToastrService,
    private accountService: AccountData
  ) {}

  ngOnInit() {
    if (this.account) {
      this.editing = true;
      this.account = this.account.copy();
      this.header = `Editing ${this.account.description}`;
    } else {
      this.account = new Account();
    }
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }

  async submit() {
    let errors = this.validate();
    if (errors.length > 0) {
      this.toasterService.warning(errors[0], "Incorrect data");
      return;
    }

    this.account = !this.editing
      ? await this.accountService.createAccount(
          this.account.type,
          this.account.description,
          this.account.icon.pack,
          this.account.icon.name,
          this.account.icon.color
        )
      : await this.accountService.updateAccount(
          this.account.id,
          this.account.description,
          this.account.isDefault,
          this.account.icon.pack,
          this.account.icon.name,
          this.account.icon.color
        );

    this.dialogRef.close({ success: true, account: this.account });
  }

  openIconChanger() {
    this.setPopoverContext();
    this.popover.toggle();
  }

  closeIconChanger() {
    this.popover.hide();
  }

  setPopoverContext() {
    this.iconPickerContext = {
      icon: this.account.icon.name,
      pack: this.account.icon.pack,
      color: this.account.icon.color,
      onIconChange: this.onIconChange.bind(this),
      onColorChange: this.onColorChange.bind(this),
    };
  }

  onIconChange(icon: FontAwesomeIcon) {
    this.account.icon.name = icon.icon;
    this.account.icon.pack = icon.iconPack;
    this.closeIconChanger();
  }

  onColorChange(color: string) {
    this.account.icon.color = color;
  }

  private validate() {
    let messages: string[] = [];

    if (this.account.description.trim().length < 3)
      messages.push("Description must contain at least 3 characters");

    // TODO

    return messages;
  }
}
