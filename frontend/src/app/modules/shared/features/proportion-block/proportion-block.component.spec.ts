import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProportionBlockComponent } from './proportion-block.component';

describe('ProportionBlockComponent', () => {
  let component: ProportionBlockComponent;
  let fixture: ComponentFixture<ProportionBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProportionBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProportionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
