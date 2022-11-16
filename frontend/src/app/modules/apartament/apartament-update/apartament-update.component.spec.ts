import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentUpdateComponent } from './apartament-update.component';

describe('ApartamentUpdateComponent', () => {
  let component: ApartamentUpdateComponent;
  let fixture: ComponentFixture<ApartamentUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
