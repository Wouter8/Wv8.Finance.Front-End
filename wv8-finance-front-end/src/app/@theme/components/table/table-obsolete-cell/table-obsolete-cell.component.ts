import { Component, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'table-obsolete-cell',
  templateUrl: './table-obsolete-cell.component.html',
  styleUrls: ['./table-obsolete-cell.component.scss']
})
export class TableObsoleteCellComponent implements OnInit, ViewCell {
  
  value: any;
  rowData: any;

  constructor() { }

  ngOnInit() {
  }

}
