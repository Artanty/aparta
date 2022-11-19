import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTemplateListComponent } from './fee-template-list.component';

describe('FeeTemplateListComponent', () => {
  let component: FeeTemplateListComponent;
  let fixture: ComponentFixture<FeeTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeTemplateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
