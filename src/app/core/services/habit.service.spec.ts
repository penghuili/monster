import { TestBed, inject } from '@angular/core/testing';

import { HabitService } from './habit.service';

describe('HabitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HabitService]
    });
  });

  it('should be created', inject([HabitService], (service: HabitService) => {
    expect(service).toBeTruthy();
  }));
});
