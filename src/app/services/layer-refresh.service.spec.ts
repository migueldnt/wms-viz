import { TestBed } from '@angular/core/testing';

import { LayerRefreshService } from './layer-refresh.service';

describe('LayerRefreshService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LayerRefreshService = TestBed.get(LayerRefreshService);
    expect(service).toBeTruthy();
  });
});
