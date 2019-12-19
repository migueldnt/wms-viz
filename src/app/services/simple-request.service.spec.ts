import { TestBed } from '@angular/core/testing';

import { SimpleRequestService } from './simple-request.service';

describe('SimpleRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimpleRequestService = TestBed.get(SimpleRequestService);
    expect(service).toBeTruthy();
  });
});
