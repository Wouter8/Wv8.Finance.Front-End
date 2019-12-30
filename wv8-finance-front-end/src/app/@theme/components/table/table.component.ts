import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { TableSettings, CustomTableSettings } from './table-settings.model';
import { LocalDataSource } from 'ng2-smart-table';
import { Maybe } from 'wv8.typescript.core';

@Component({
  selector: 'wv8-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent<T> implements OnInit {

  source: LocalDataSource = new LocalDataSource();
  settings: TableSettings;

  @ViewChild('table', { static: true })
  table: Ng2SmartTable;

  @Output('select')
  onSelect = new EventEmitter<T>();

  private DEFAULT_SETTINGS: TableSettings = {
    actions: false,
    hideHeader: false,
    hideSubHeader: false,
    mode: "external",
    pager: {
      display: true,
      perPage: 25
    },
    selectMode: false,
  }

  constructor() { }

  ngOnInit() {
  }

  public setData(data: T[]) {
    this.source.load(data);
  }

  public setSettings(settings: CustomTableSettings<T>) {
    this.settings = this.DEFAULT_SETTINGS;
    
    this.settings.columns = settings.columns;

    this.settings.pager.perPage = new Maybe(settings.rowsPerPage).valueOrElse(this.DEFAULT_SETTINGS.pager.perPage);
    this.settings.selectMode = new Maybe(settings.selectMode).valueOrElse(this.DEFAULT_SETTINGS.selectMode);
    this.settings.hideSubHeader = new Maybe(settings.hideFilter).valueOrElse(this.DEFAULT_SETTINGS.hideSubHeader);
    
    this.settings.rowClassFunction = (row: { data: T }) => {
      let rowClasses: string[] = [];
      if (settings.clickable)
        rowClasses.push("clickable");
      if (settings.rowClassFunction)
        rowClasses = rowClasses.concat(settings.rowClassFunction(row.data));
      return rowClasses.join(' ');
    };
  }

  rowSelected(event: { data: T, source: T[] }) {
    if (!this.settings.selectMode)
      this.table.grid.dataSet.deselectAll();
    this.onSelect.emit(event.data);
  }

}
