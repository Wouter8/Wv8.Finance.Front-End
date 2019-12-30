import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CategoryData } from "../../../@core/data/category";
import { Category } from "../../../@core/models/category.model";
import { Maybe } from 'wv8.typescript.core';
import { CategoryType } from '../../../@core/enums/category-type';

@Component({
  selector: "category-picker",
  templateUrl: "./category-picker.component.html",
  styleUrls: ["./category-picker.component.scss"]
})
export class CategoryPickerComponent implements OnInit {
  
  categories: Category[] = [];

  @Input() category: number | Category;
  @Output() categoryChange = new EventEmitter<number | Category>();

  constructor(private categoryService: CategoryData) {}

  ngOnInit() {
    this.category = this.category instanceof Category
      ? this.category.id
      : this.category;

    this.categoryService
      .getCategoriesByFilter(false, new Maybe(CategoryType.Expense))
      .subscribe(categories => (this.categories = categories));
  }
}
