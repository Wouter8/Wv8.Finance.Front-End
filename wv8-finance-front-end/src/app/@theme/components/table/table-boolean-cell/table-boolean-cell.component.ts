import { Component, OnInit, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'table-boolean-cell',
  templateUrl: './table-boolean-cell.component.html',
  styleUrls: ['./table-boolean-cell.component.scss']
})
export class TableBooleanCellComponent implements OnInit, ViewCell {

  @Input()
  value: any;
  @Input()
  rowData: any;

  constructor() { }

  ngOnInit() {
  }

}
