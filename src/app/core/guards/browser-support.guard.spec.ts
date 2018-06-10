import { TestBed, async, inject } from '@angular/core/testing';

import { BrowserSupportGuard } from './browser-support.guard';

describe('BrowserSupportGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowserSupportGuard]
    });
  });

  it('should ...', inject([BrowserSupportGuard], (guard: BrowserSupportGuard) => {
    expect(guard).toBeTruthy();
  }));
});
