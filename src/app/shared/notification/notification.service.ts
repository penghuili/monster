import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

@Injectable()
export class NotificationService {
  private message$ = new BehaviorSubject<string>('');

  constructor() {
    this.message$.asObservable().pipe(
      debounceTime(3000),
      filter(m => !!m)
    ).subscribe(m => {
      this.message$.next('');
    });
  }

  sendMessage(message: string) {
    this.message$.next(message);
  }
  getMessage(): Observable<string> {
    return this.message$.asObservable();
  }
}
