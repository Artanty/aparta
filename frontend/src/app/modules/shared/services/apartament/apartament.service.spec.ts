import { TestBed } from '@angular/core/testing';

import { ApartamentService } from './apartament.service';

describe('ApartamentService', () => {
  let service: ApartamentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApartamentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
