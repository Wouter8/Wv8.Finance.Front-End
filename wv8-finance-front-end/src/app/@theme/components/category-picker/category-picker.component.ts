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
import { Maybe } from "wv8.typescript.core";
import { CategoryType } from "../../../@core/enums/category-type";

@Component({
  selector: "category-picker",
  templateUrl: "./category-picker.component.html",
  styleUrls: ["./category-picker.component.scss"]
})
export class CategoryPickerComponent implements OnInit {
  categories: Category[];

  inputIsObject = false;

  @Input() typeFilter: Maybe<CategoryType> = Maybe.none();
  @Input() placeholderText: string = "Select category";
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() includeObsolete: boolean = false;
  @Input() filterCategories: number[] = [];
  @Input() showResetOption: boolean = false;
  @Input() category: number | Category;
  @Output() categoryChange = new EventEmitter<number | Category>();

  selectedCategory: Category = undefined;
  categoryId: number = undefined;

  constructor(private categoryService: CategoryData) {}

  async ngOnInit() {
    if (this.category instanceof Category) {
      this.inputIsObject = true;
      this.categoryId = this.category.id;
    } else {
      this.categoryId = this.category;
    }

    this.categories =
      this.categoryId && this.disabled
        ? [
            (await this.categoryService.getCategory(this.categoryId))
              .parentCategory.value
          ]
        : (
            await this.categoryService.getCategoriesByFilter(
              this.includeObsolete,
              this.typeFilter.valueOrElse(CategoryType.Expense),
              false
            )
          ).filter(c => this.filterCategories.indexOf(c.id) < 0);

    if (this.categoryId) {
      this.selectedCategory = this.categories.filter(
        c => c.id == this.categoryId
      )[0];
    }
    this.categories = this.categories.filter(c => c.parentCategoryId.isNone);
  }

  categorySelected() {
    if (!this.categoryId) {
      return this.categoryChange.emit(undefined);
    }

    this.selectedCategory = this.categories.filter(
      c => c.id == this.categoryId
    )[0];
    if (!this.selectedCategory) {
      this.selectedCategory = this.categories
        .filter(
          c => c.children.map(child => child.id).indexOf(this.categoryId) >= 0
        )[0]
        .children.filter(c => c.id == this.categoryId)[0];
    }

    this.categoryChange.emit(
      this.inputIsObject ? this.selectedCategory : this.selectedCategory.id
    );
  }
}
