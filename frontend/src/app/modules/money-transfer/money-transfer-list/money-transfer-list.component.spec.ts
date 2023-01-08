import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyTransferListComponent } from './money-transfer-list.component';

describe('MoneyTransferListComponent', () => {
  let component: MoneyTransferListComponent;
  let fixture: ComponentFixture<MoneyTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyTransferListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
