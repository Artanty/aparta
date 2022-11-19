import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTemplateComponent } from './fee-template.component';

describe('FeeTemplateComponent', () => {
  let component: FeeTemplateComponent;
  let fixture: ComponentFixture<FeeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
