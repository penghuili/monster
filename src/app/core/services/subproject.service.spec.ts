import { TestBed, inject } from '@angular/core/testing';

import { SubprojectService } from './subproject.service';

describe('SubprojectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubprojectService]
    });
  });

  it('should be created', inject([SubprojectService], (service: SubprojectService) => {
    expect(service).toBeTruthy();
  }));
});
