import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsCurrancySourceComponent } from './widgets-currancy-source.component';

describe('WidgetsCurrancySourceComponent', () => {
  let component: WidgetsCurrancySourceComponent;
  let fixture: ComponentFixture<WidgetsCurrancySourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetsCurrancySourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsCurrancySourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
