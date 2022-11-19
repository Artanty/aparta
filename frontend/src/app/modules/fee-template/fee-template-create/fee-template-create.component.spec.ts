import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTemplateCreateComponent } from './fee-template-create.component';

describe('FeeTemplateCreateComponent', () => {
  let component: FeeTemplateCreateComponent;
  let fixture: ComponentFixture<FeeTemplateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeTemplateCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTemplateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
