import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationTariffUpdateComponent } from './organization-tariff-update.component';

describe('OrganizationTariffUpdateComponent', () => {
  let component: OrganizationTariffUpdateComponent;
  let fixture: ComponentFixture<OrganizationTariffUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationTariffUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationTariffUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
