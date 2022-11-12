import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentCreateComponent } from './apartament-create.component';

describe('ApartamentCreateComponent', () => {
  let component: ApartamentCreateComponent;
  let fixture: ComponentFixture<ApartamentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
