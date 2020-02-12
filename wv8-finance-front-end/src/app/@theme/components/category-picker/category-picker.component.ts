import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CategoryData } from "../../../@core/data/category";
import { Category } from "../../../@core/models/category.model";
import { Maybe } from "wv8.typescript.core";
import { CategoryType } from "../../../@core/enums/category-type";

@Component({
  selector: "category-picker",
  templateUrl: "./category-picker.component.html",
  styleUrls: ["./category-picker.component.scss"]
})
export class CategoryPickerComponent implements OnInit {
  categories: Category[];
  hasSubCategories = false;

  inputIsObject = false;

  @Input() filterCategories: number[] = [];
  @Input() showEmptyOption: boolean = false;
  @Input() showSubCategory: boolean = true;
  @Input() category: number | Category;
  @Output() categoryChange = new EventEmitter<number | Category>();

  selectedCategory: Category = undefined;
  categoryId: number = undefined;
  subCategoryId: number = undefined;

  constructor(private categoryService: CategoryData) {}

  ngOnInit() {
    if (this.category instanceof Category) {
      this.inputIsObject = true;
      this.categoryId = this.category.id;
    } else {
      this.categoryId = this.category;
    }

    this.categoryService
      .getCategoriesByFilter(false, CategoryType.Expense)
      .subscribe(
        categories =>
          (this.categories = categories.filter(
            c => this.filterCategories.indexOf(c.id) < 0
          ))
      );
  }

  categorySelected() {
    if (!this.categoryId) {
      return this.categoryChange.emit(undefined);
    }

    this.selectedCategory = this.categories.filter(
      c => c.id == this.categoryId
    )[0];

    if (this.showSubCategory) {
      this.subCategoryId = undefined;
      this.hasSubCategories = this.selectedCategory.children.length > 0;
      this.subCategoryId = this.hasSubCategories ? -1 : undefined;
    }

    this.categoryChange.emit(
      this.inputIsObject ? this.selectedCategory : this.selectedCategory.id
    );
  }

  subCategorySelected() {
    if (this.subCategoryId === -1) {
      this.categoryChange.emit(
        this.inputIsObject ? this.selectedCategory : this.selectedCategory.id
      );
      return;
    }

    let sub = this.selectedCategory.children.filter(
      c => c.id == this.subCategoryId
    )[0];

    this.categoryChange.emit(this.inputIsObject ? sub : sub.id);
  }
}
