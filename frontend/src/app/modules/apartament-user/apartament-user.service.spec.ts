import { TestBed } from '@angular/core/testing';

import { ApartamentUserService } from './apartament-user.service';

describe('ApartamentUserService', () => {
  let service: ApartamentUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApartamentUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
