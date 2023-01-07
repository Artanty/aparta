import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentFeeCompareComponent } from './apartament-fee-compare.component';

describe('ApartamentFeeCompareComponent', () => {
  let component: ApartamentFeeCompareComponent;
  let fixture: ComponentFixture<ApartamentFeeCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentFeeCompareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentFeeCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
