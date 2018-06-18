import { TestBed, inject } from '@angular/core/testing';

import { FollowingService } from './following.service';

describe('FollowingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FollowingService]
    });
  });

  it('should be created', inject([FollowingService], (service: FollowingService) => {
    expect(service).toBeTruthy();
  }));
});
