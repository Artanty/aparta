import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAlibiComponent } from './ng-alibi.component';

describe('NgAlibiComponent', () => {
  let component: NgAlibiComponent;
  let fixture: ComponentFixture<NgAlibiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgAlibiComponent]
    });
    fixture = TestBed.createComponent(NgAlibiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
