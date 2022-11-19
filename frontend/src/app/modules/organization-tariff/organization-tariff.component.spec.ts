import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationTariffComponent } from './organization-tariff.component';

describe('OrganizationTariffComponent', () => {
  let component: OrganizationTariffComponent;
  let fixture: ComponentFixture<OrganizationTariffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationTariffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
