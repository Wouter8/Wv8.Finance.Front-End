import { Component, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'table-name-cell',
  templateUrl: './table-name-cell.component.html',
  styleUrls: ['./table-name-cell.component.scss']
})
export class TableNameCellComponent implements OnInit, ViewCell {
  
  value: any;
  rowData: any;

  overrideProperty: string;
  searchInChilds: boolean = false;

  constructor() { }

  ngOnInit() {
    if (this.searchInChilds){
      this.searchIconIn(this.rowData);
      return;
    }

    if (this.overrideProperty) {
      this.searchIconIn(this.rowData[this.overrideProperty]);
      return;
    }
  }

  searchIconIn(object: { }) {
    if (object['icon']) {
      this.rowData = object;
      return;
    }

    for (let prop in object) {
      let obj = object[prop];
      if (obj === null || obj === undefined) continue;
      if (typeof(obj) === 'object' && obj) {
        if (obj['icon']) {
          this.rowData = obj;
          return;
        } else {
          this.searchIconIn(obj);
        }
      }
    }
  }

}
