import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentFeeCreateComponent } from './apartament-fee-create.component';

describe('ApartamentFeeCreateComponent', () => {
  let component: ApartamentFeeCreateComponent;
  let fixture: ComponentFixture<ApartamentFeeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentFeeCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentFeeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
