import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateCreateComponent } from './exchange-rate-create.component';

describe('ExchangeRateCreateComponent', () => {
  let component: ExchangeRateCreateComponent;
  let fixture: ComponentFixture<ExchangeRateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeRateCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
