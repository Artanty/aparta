import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentUserCreateComponent } from './apartament-user-create.component';

describe('ApartamentUserCreateComponent', () => {
  let component: ApartamentUserCreateComponent;
  let fixture: ComponentFixture<ApartamentUserCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentUserCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentUserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
