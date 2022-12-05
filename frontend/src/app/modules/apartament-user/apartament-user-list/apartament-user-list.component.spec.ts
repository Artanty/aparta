import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartamentUserListComponent } from './apartament-user-list.component';

describe('ApartamentUserListComponent', () => {
  let component: ApartamentUserListComponent;
  let fixture: ComponentFixture<ApartamentUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApartamentUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartamentUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
