import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrancyTableCellComponent } from './currancy-table-cell.component';

describe('CurrancyTableCellComponent', () => {
  let component: CurrancyTableCellComponent;
  let fixture: ComponentFixture<CurrancyTableCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrancyTableCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrancyTableCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
