import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationTariffListComponent } from './organization-tariff-list.component';

describe('OrganizationTariffListComponent', () => {
  let component: OrganizationTariffListComponent;
  let fixture: ComponentFixture<OrganizationTariffListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationTariffListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationTariffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
