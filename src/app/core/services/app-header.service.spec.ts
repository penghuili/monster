import { TestBed, inject } from '@angular/core/testing';

import { AppHeaderService } from './app-header.service';

describe('AppHeaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppHeaderService]
    });
  });

  it('should be created', inject([AppHeaderService], (service: AppHeaderService) => {
    expect(service).toBeTruthy();
  }));
});
