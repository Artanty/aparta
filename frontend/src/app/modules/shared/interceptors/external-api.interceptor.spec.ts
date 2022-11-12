import { TestBed } from '@angular/core/testing';

import { ExternalApiInterceptor } from './external-api.interceptor';

describe('ExternalApiInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ExternalApiInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ExternalApiInterceptor = TestBed.inject(ExternalApiInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
