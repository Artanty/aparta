import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentFeeListComponent } from './apartament-fee-list.component';

describe('ApartamentFeeListComponent', () => {
  let component: ApartamentFeeListComponent;
  let fixture: ComponentFixture<ApartamentFeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentFeeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentFeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
