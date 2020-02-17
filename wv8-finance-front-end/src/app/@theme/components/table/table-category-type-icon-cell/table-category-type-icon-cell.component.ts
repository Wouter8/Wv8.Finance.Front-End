import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "ng2-smart-table";
import { CategoryType } from "../../../../@core/enums/category-type";

@Component({
  selector: "table-category-type-icon-cell",
  templateUrl: "./table-category-type-icon-cell.component.html",
  styleUrls: ["./table-category-type-icon-cell.component.scss"]
})
export class TableCategoryTypeIconCellComponent implements OnInit, ViewCell {
  @Input()
  value: any;
  @Input()
  rowData: any;

  tooltipText: string = "";

  constructor() {}

  ngOnInit() {
    this.tooltipText = CategoryType.getCategoryTypeString(this.value);
  }
}
