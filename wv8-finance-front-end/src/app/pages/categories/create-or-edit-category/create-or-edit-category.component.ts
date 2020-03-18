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
    private categoryService: CategoryData,
    protected dialogRef: NbDialogRef<CreateOrEditCategoryComponent>,
    private toasterService: NbToastrService
  ) { }

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

  async submit() {
    let errors = this.validate();
    if (errors.length > 0) {
      this.toasterService.warning(errors[0], "Incorrect data");
      return;
    }

    let expectedMonthlyAmount = this.category.expectedMonthlyAmount.map(a =>
      this.category.type == CategoryType.Expense
        ? -a
        : a
    );

    if (this.editing) {
      this.category = await this.categoryService.updateCategory(
        this.category.id,
        this.category.description,
        this.category.type,
        expectedMonthlyAmount,
        this.category.parentCategoryId,
        this.category.icon.pack,
        this.category.icon.name,
        this.category.icon.color,
      );
      this.dialogRef.close({ success: true, category: this.category });
    } else {
      this.category = await this.categoryService.createCategory(
        this.category.description,
        this.category.type,
        expectedMonthlyAmount,
        this.category.parentCategoryId,
        this.category.icon.pack,
        this.category.icon.name,
        this.category.icon.color,
      );
      this.dialogRef.close({ success: true, category: this.category });
    }
  }

  setParentCategory(categoryId: number) {
    this.category.parentCategoryId = new Maybe(categoryId);
  }

  setExpectedMonthlyAmount(amount: number) {
    this.category.expectedMonthlyAmount = new Maybe(amount);
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
