import { inject, TestBed } from '@angular/core/testing';

import { IconsService } from './icons.service';

describe('IconsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IconsService]
    });
  });

  it('should be created', inject([IconsService], (service: IconsService) => {
    expect(service).toBeTruthy();
  }));
});
