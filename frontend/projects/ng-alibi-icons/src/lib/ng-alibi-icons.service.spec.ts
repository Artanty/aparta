import { TestBed } from '@angular/core/testing';

import { NgAlibiIconsService } from './ng-alibi-icons.service';

describe('NgAlibiIconsService', () => {
  let service: NgAlibiIconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgAlibiIconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
