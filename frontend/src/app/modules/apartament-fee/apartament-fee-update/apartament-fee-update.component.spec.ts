import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentFeeUpdateComponent } from './apartament-fee-update.component';

describe('ApartamentFeeUpdateComponent', () => {
  let component: ApartamentFeeUpdateComponent;
  let fixture: ComponentFixture<ApartamentFeeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentFeeUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentFeeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
