import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyTransferUpdateComponent } from './money-transfer-update.component';

describe('MoneyTransferUpdateComponent', () => {
  let component: MoneyTransferUpdateComponent;
  let fixture: ComponentFixture<MoneyTransferUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyTransferUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyTransferUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
