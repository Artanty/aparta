import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyTransferCreateComponent } from './money-transfer-create.component';

describe('MoneyTransferCreateComponent', () => {
  let component: MoneyTransferCreateComponent;
  let fixture: ComponentFixture<MoneyTransferCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyTransferCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyTransferCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
