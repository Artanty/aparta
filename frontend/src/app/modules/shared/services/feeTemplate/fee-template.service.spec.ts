import { TestBed } from '@angular/core/testing';

import { FeeTemplateService } from './fee-template.service';

describe('FeeTemplateService', () => {
  let service: FeeTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeeTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
