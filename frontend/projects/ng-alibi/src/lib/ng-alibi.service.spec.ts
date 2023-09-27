import { TestBed } from '@angular/core/testing';

import { NgAlibiService } from './ng-alibi.service';

describe('NgAlibiService', () => {
  let service: NgAlibiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgAlibiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
