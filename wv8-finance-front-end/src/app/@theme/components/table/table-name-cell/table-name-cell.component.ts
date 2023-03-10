import { Component, OnInit, Input } from "@angular/core";
import { ViewCell } from "angular2-smart-table";

@Component({
  selector: "table-name-cell",
  templateUrl: "./table-name-cell.component.html",
  styleUrls: ["./table-name-cell.component.scss"],
})
export class TableNameCellComponent<T> implements OnInit, ViewCell {
  @Input()
  value: any;
  @Input()
  rowData: any;

  typedData: T;

  @Input()
  nameFunction: () => string;
  @Input()
  isDefaultFunction: () => boolean;
  @Input()
  isObsoleteFunction: () => boolean;
  @Input()
  iconFunction: () => { pack: string; name: string; color: string };

  @Input()
  showDefaultIcon: boolean = true;
  @Input()
  showObsoleteIcon: boolean = true;
  @Input()
  showIcon: boolean = true;
  @Input()
  iconSize: "normal" | "small" = "normal";

  name: string = "";
  isDefault: boolean = false;
  isObsolete: boolean = false;
  icon: {
    pack: string;
    name: string;
    color: string;
  };

  constructor() {}

  ngOnInit() {
    this.typedData = this.rowData;

    this.name = this.nameFunction ? this.nameFunction() : this.rowData["description"];
    this.isDefault = this.isDefaultFunction ? this.isDefaultFunction() : this.rowData["isDefault"];
    this.isObsolete = this.isObsoleteFunction ? this.isObsoleteFunction() : this.rowData["isObsolete"];
    this.icon = this.iconFunction ? this.iconFunction() : this.rowData["icon"];
  }
}
