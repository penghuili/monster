import { TestBed, inject } from '@angular/core/testing';

import { StorageApiService } from './storage-api.service';

describe('StorageApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageApiService]
    });
  });

  it('should be created', inject([StorageApiService], (service: StorageApiService) => {
    expect(service).toBeTruthy();
  }));
});
