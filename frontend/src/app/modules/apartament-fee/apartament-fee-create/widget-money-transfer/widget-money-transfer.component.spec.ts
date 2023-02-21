import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetMoneyTransferComponent } from './widget-money-transfer.component';

describe('WidgetMoneyTransferComponent', () => {
  let component: WidgetMoneyTransferComponent;
  let fixture: ComponentFixture<WidgetMoneyTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetMoneyTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetMoneyTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
