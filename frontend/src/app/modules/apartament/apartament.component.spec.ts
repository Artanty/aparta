import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentComponent } from './apartament.component';

describe('ApartamentComponent', () => {
  let component: ApartamentComponent;
  let fixture: ComponentFixture<ApartamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
