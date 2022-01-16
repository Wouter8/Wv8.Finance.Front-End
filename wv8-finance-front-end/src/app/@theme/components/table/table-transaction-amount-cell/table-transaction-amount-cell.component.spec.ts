import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTransactionAmountCellComponent } from './table-transaction-amount-cell.component';

describe('TableTransactionAmountCellComponent', () => {
  let component: TableTransactionAmountCellComponent;
  let fixture: ComponentFixture<TableTransactionAmountCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTransactionAmountCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTransactionAmountCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
