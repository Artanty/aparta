import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateFeeTemplateComponent } from './modal-create-fee-template.component';

describe('ModalCreateFeeTemplateComponent', () => {
  let component: ModalCreateFeeTemplateComponent;
  let fixture: ComponentFixture<ModalCreateFeeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateFeeTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateFeeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
