import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpdateFeeTemplateComponent } from './modal-update-fee-template.component';

describe('ModalUpdateFeeTemplateComponent', () => {
  let component: ModalUpdateFeeTemplateComponent;
  let fixture: ComponentFixture<ModalUpdateFeeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUpdateFeeTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUpdateFeeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
