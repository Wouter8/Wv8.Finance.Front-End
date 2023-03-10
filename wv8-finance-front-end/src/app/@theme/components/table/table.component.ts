import { Component, OnInit, Output, EventEmitter, ViewChild, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Actions, Angular2SmartTableComponent, LocalDataSource, Pager, Settings } from "angular2-smart-table";
import { Maybe } from "@wv8/typescript.core";
import { TablePagination } from "./table-pagination-model";

@Component({
  selector: "wv8-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent<T> implements OnInit, OnChanges {
  @ViewChild("table", { static: true })
  table: Angular2SmartTableComponent;

  @Input()
  onPageChange: (page: number) => void;
  @Output("select")
  onSelect = new EventEmitter<T>();
  @Input() initialPage: number = 1;

  source: LocalDataSource = new LocalDataSource();
  settings: Settings;
  currentPage: number = 1;
  totalPages: number = 1;
  pager: Pager = {
    display: false,
    perPage: 25,
  };

  private DEFAULT_SETTINGS: Settings = {
    actions: { add: false, edit: false, delete: false, custom: [] },
    hideHeader: false,
    hideSubHeader: true,
    mode: "external",
    selectMode: "single",
    pager: {
      display: true,
      perPage: 25,
    },
    attr: {
      class: "table",
    },
  };

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.currentPage = this.initialPage;
  }

  ngOnInit() {}

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

  public setSettings(settings: Settings) {
    this.settings = this.DEFAULT_SETTINGS;

    this.settings.columns = settings.columns;

    if (settings.pager) {
      this.pager.display = new Maybe(settings.pager.display).valueOrElse(this.pager.display);
      this.pager.perPage = new Maybe(settings.pager.perPage).valueOrElse(this.pager.perPage);
    }
    this.settings.selectMode = new Maybe(settings.selectMode).valueOrElse(this.DEFAULT_SETTINGS.selectMode);
    this.settings.hideSubHeader = new Maybe(settings.hideSubHeader).valueOrElse(this.DEFAULT_SETTINGS.hideSubHeader);

    this.settings.rowClassFunction = (row: { data: T }) => {
      let rowClasses: string[] = [];
      rowClasses.push("clickable");
      if (settings.rowClassFunction) rowClasses = rowClasses.concat(settings.rowClassFunction(row.data));
      return rowClasses.join(" ");
    };
  }

  rowSelected(event: { data: T; source: T[] }) {
    if (!this.settings.selectMode) this.table.grid.dataSet.deselectAll();
    this.onSelect.emit(event.data);
  }
}
