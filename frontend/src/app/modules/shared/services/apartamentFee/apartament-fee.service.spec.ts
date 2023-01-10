import { TestBed } from '@angular/core/testing';

import { ApartamentFeeService } from './apartament-fee.service';

describe('ApartamentFeeService', () => {
  let service: ApartamentFeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApartamentFeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
