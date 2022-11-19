import { TestBed } from '@angular/core/testing';

import { OrganizationTariffService } from './organization-tariff.service';

describe('OrganizationTariffService', () => {
  let service: OrganizationTariffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationTariffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
