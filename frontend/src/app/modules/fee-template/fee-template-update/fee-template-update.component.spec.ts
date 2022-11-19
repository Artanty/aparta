import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTemplateUpdateComponent } from './fee-template-update.component';

describe('FeeTemplateUpdateComponent', () => {
  let component: FeeTemplateUpdateComponent;
  let fixture: ComponentFixture<FeeTemplateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeTemplateUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTemplateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
