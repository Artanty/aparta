import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlibiLibComponent } from './alibi-lib.component';

describe('AlibiLibComponent', () => {
  let component: AlibiLibComponent;
  let fixture: ComponentFixture<AlibiLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlibiLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlibiLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
