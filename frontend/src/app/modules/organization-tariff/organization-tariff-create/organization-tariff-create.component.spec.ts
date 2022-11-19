import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationTariffCreateComponent } from './organization-tariff-create.component';

describe('OrganizationTariffCreateComponent', () => {
  let component: OrganizationTariffCreateComponent;
  let fixture: ComponentFixture<OrganizationTariffCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationTariffCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationTariffCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
