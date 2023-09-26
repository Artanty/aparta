import { TestBed } from '@angular/core/testing';

import { AlibiLibService } from './alibi-lib.service';

describe('AlibiLibService', () => {
  let service: AlibiLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlibiLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
