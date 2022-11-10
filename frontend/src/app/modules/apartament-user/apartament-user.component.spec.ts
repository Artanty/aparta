import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentUserComponent } from './apartament-user.component';

describe('ApartamentUserComponent', () => {
  let component: ApartamentUserComponent;
  let fixture: ComponentFixture<ApartamentUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
