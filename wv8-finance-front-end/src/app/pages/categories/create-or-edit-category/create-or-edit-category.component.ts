import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { CategoryData, ICategory } from "../../../@core/data/category";
import { Category } from "../../../@core/models/category.model";
import {
  NbDialogRef,
  NbToastrService,
  NbToastrConfig,
  NbDialogService,
  NbTrigger,
  NbPopoverDirective
} from "@nebular/theme";
import { FontAwesomeIconPickerComponent } from "../../../@theme/components/font-awesome-icon-picker/font-awesome-icon-picker.component";
import { FontAwesomeIcon } from "../../../@theme/components/font-awesome-icon-picker/font-awesome-icon";
import { CategoryType } from "../../../@core/enums/category-type";
import { Maybe } from "@wv8/typescript.core";

@Component({
  selector: "create-or-edit-category",
  templateUrl: "./create-or-edit-category.component.html",
  styleUrls: ["./create-or-edit-category.component.scss"]
})
export class CreateOrEditCategoryComponent implements OnInit {
  @Input()
  category: Category;
  @Input()
  initialType: CategoryType = undefined;

  types = CategoryType;

  editing = false;
  header: string = "Creating new category";

  @ViewChild(NbPopoverDirective, { static: false })
  popover: NbPopoverDirective;
  iconPickerComponent = FontAwesomeIconPickerComponent;
  iconPickerContext: any;

  constructor(
    protected dialogRef: NbDialogRef<CreateOrEditCategoryComponent>,
    private toasterService: NbToastrService
  ) {}

  ngOnInit() {
    if (this.category) {
      this.editing = true;
      this.category = this.category.copy();
      this.header = `Editing ${this.category.description}`;
    } else {
      this.category = new Category();
      if (this.initialType) this.category.type = this.initialType;
    }
  }

  cancel() {
    this.dialogRef.close({ success: false });
  }

  submit() {
    let errors = this.validate();
    if (errors.length > 0) {
      this.toasterService.warning(errors[0], "Incorrect data");
      return;
    }

    // TODO: Save to back-end here.

    this.dialogRef.close({ success: true, category: this.category });
  }

  setParentCategory(categoryId: number) {
    this.category.parentCategoryId = new Maybe(categoryId);
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
      icon: this.category.icon,
      pack: this.category.icon.pack,
      color: this.category.icon.color,
      onIconChange: this.onIconChange.bind(this),
      onColorChange: this.onColorChange.bind(this)
    };
  }

  onIconChange(icon: FontAwesomeIcon) {
    this.category.icon.name = icon.icon;
    this.category.icon.pack = icon.iconPack;
    this.closeIconChanger();
  }

  onColorChange(color: string) {
    this.category.icon.color = color;
  }

  private validate() {
    let messages: string[] = [];

    if (this.category.description.trim().length < 3)
      messages.push("Description must contain at least 3 characters");

    return messages;
  }
}
