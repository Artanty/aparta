import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgAlibiIconsComponent } from './ng-alibi-icons.component';

describe('NgAlibiIconsComponent', () => {
  let component: NgAlibiIconsComponent;
  let fixture: ComponentFixture<NgAlibiIconsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NgAlibiIconsComponent]
    });
    fixture = TestBed.createComponent(NgAlibiIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
