import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentListComponent } from './apartament-list.component';

describe('ApartamentListComponent', () => {
  let component: ApartamentListComponent;
  let fixture: ComponentFixture<ApartamentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
