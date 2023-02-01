import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from "@angular/core";
import { TableSettings, CustomTableSettings, Pager } from "./table-settings.model";
import { LocalDataSource } from "ng2-smart-table";
import { Maybe } from "@wv8/typescript.core";
import { TablePagination } from "./table-pagination-model";

@Component({
  selector: "wv8-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent<T> implements OnInit {
  @ViewChild("table", { static: true })
  table: Ng2SmartTable;

  @Input()
  onPageChange: (page: number) => void;
  @Output("select")
  onSelect = new EventEmitter<T>();
  @Input() initialPage: number = 1;

  source: LocalDataSource = new LocalDataSource();
  settings: TableSettings;
  currentPage: number = 1;
  totalPages: number = 1;
  pager: Pager = {
    display: false,
    perPage: 25,
  };

  private DEFAULT_SETTINGS: TableSettings = {
    actions: false,
    hideHeader: false,
    hideSubHeader: false,
    mode: "external",
    selectMode: false,
    pager: {
      display: false,
    },
    attr: {
      class: "table",
    },
  };

  constructor() {}

  ngOnInit() {
    this.currentPage = this.initialPage;
  }

  goToPage(i: number) {
    this.currentPage = i;
    this.onPageChange(this.currentPage);
  }

  getPaginationNumbers(): number[] {
    let result = [];
    let i = this.currentPage == this.totalPages ? this.currentPage - 2 : this.currentPage - 1;
    while (result.length < 3) {
      if (i > 0) {
        result.push(i);
      }

      if (i == this.totalPages) break;

      i++;
    }
    return result;
  }

  public setData(data: T[]) {
    this.source.load(data);
  }

  public setSettings(settings: CustomTableSettings<T>) {
    this.settings = this.DEFAULT_SETTINGS;

    this.settings.columns = settings.columns;

    if (settings.pager) {
      this.pager.display = new Maybe(settings.pager.display).valueOrElse(this.pager.display);
      this.pager.perPage = new Maybe(settings.pager.perPage).valueOrElse(this.pager.perPage);
    }
    this.settings.selectMode = new Maybe(settings.selectMode).valueOrElse(this.DEFAULT_SETTINGS.selectMode);
    this.settings.hideSubHeader = new Maybe(settings.hideFilter).valueOrElse(this.DEFAULT_SETTINGS.hideSubHeader);

    this.settings.rowClassFunction = (row: { data: T }) => {
      let rowClasses: string[] = [];
      if (settings.clickable) rowClasses.push("clickable");
      if (settings.rowClassFunction) rowClasses = rowClasses.concat(settings.rowClassFunction(row.data));
      return rowClasses.join(" ");
    };
  }

  rowSelected(event: { data: T; source: T[] }) {
    if (!this.settings.selectMode) this.table.grid.dataSet.deselectAll();
    this.onSelect.emit(event.data);
  }
}
