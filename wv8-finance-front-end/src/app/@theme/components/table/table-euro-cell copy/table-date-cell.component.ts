import { Component, OnInit, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'table-date-cell',
  templateUrl: './table-date-cell.component.html',
  styleUrls: ['./table-date-cell.component.scss']
})
export class TableDateCellComponent implements OnInit, ViewCell {

  @Input()
  value: any;
  @Input()
  rowData: any;

  constructor() { }

  ngOnInit() {
  }

}
