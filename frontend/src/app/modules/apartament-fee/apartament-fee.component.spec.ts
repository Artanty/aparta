import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentFeeComponent } from './apartament-fee.component';

describe('ApartamentFeeComponent', () => {
  let component: ApartamentFeeComponent;
  let fixture: ComponentFixture<ApartamentFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentFeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
