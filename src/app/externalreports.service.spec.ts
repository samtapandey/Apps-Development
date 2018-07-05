import { TestBed, inject } from '@angular/core/testing';

import { ExternalreportsService } from './externalreports.service';

describe('ExternalreportsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalreportsService]
    });
  });

  it('should be created', inject([ExternalreportsService], (service: ExternalreportsService) => {
    expect(service).toBeTruthy();
  }));
});
