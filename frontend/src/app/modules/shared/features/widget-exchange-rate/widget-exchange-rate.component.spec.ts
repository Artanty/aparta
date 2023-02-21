import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetExchangeRateComponent } from './widget-exchange-rate.component';

describe('WidgetExchangeRateComponent', () => {
  let component: WidgetExchangeRateComponent;
  let fixture: ComponentFixture<WidgetExchangeRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetExchangeRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetExchangeRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
