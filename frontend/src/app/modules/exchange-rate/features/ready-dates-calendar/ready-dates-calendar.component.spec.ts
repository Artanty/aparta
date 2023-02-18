import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyDatesCalendarComponent } from './ready-dates-calendar.component';

describe('ReadyDatesCalendarComponent', () => {
  let component: ReadyDatesCalendarComponent;
  let fixture: ComponentFixture<ReadyDatesCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadyDatesCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyDatesCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
