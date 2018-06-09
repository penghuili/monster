import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class InputService {
  private focus$ = new Subject<boolean>();

  getFocusStatus() {
    return this.focus$.asObservable();
  }
  isFocusing() {
    this.focus$.next(true);
  }
  isBlurred() {
    this.focus$.next(false);
  }
}
