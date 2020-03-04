import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";
import { CategoryData } from "../../../@core/data/category";
import { Category } from "../../../@core/models/category.model";
import { Maybe } from "@wv8/typescript.core";
import { CategoryType } from "../../../@core/enums/category-type";

@Component({
  selector: "category-picker",
  templateUrl: "./category-picker.component.html",
  styleUrls: ["./category-picker.component.scss"]
})
export class CategoryPickerComponent implements OnInit, OnChanges {
  categories: Category[] = [];

  inputIsObject = false;

  @Input() typeFilter: CategoryType = CategoryType.Expense;
  @Input() placeholderText: string = "Select category";
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() includeObsolete: boolean = false;
  @Input() filterCategories: number[] = [];
  @Input() showResetOption: boolean = false;
  @Input() showSubCategories: boolean = true;
  @Input() category: number | Category;
  @Output() categoryChange = new EventEmitter<number | Category>();

  categoryId: number = undefined;

  constructor(private categoryService: CategoryData) {}

  async ngOnInit() {}

  async ngOnChanges() {
    let categoryId: number;
    if (this.category instanceof Category) {
      this.inputIsObject = true;
      categoryId = this.category.id;
    } else {
      categoryId = this.category;
    }

    this.categories = (
      await this.categoryService.getCategoriesByFilter(
        this.includeObsolete,
        this.typeFilter,
        false
      )
    ).filter(c => this.filterCategories.indexOf(c.id) < 0);

    this.categories = this.categories.filter(c => c.parentCategoryId.isNone);

    if (
      categoryId &&
      this.categories.map(c => c.id).indexOf(categoryId) < 0 &&
      this.categories
        .map(c => c.children)
        .reduce((a, b) => a.concat(b))
        .map(c => c.id)
        .indexOf(categoryId) < 0
    ) {
      let obsoleteCategory = await this.categoryService.getCategory(categoryId);
      this.categories.push(
        obsoleteCategory.parentCategoryId.isNone
          ? obsoleteCategory
          : obsoleteCategory.parentCategory.value
      );
    }

    // Set after loading of categories so that option is properly selected.
    setTimeout(() => {
      this.categoryId = categoryId;
    });
  }

  categorySelected() {
    if (!this.categoryId) {
      return this.categoryChange.emit(undefined);
    }

    let selectedCategory = this.categories.filter(
      c => c.id == this.categoryId
    )[0];
    if (!selectedCategory) {
      selectedCategory = this.categories
        .filter(
          c => c.children.map(child => child.id).indexOf(this.categoryId) >= 0
        )[0]
        .children.filter(c => c.id == this.categoryId)[0];
    }

    this.categoryChange.emit(
      this.inputIsObject ? selectedCategory : selectedCategory.id
    );
  }
}
