import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NotificationService {
  private message$ = new BehaviorSubject<string>('');

  senMessage(message: string) {
    this.message$.next(message);
  }
  getMessage(): Observable<string> {
    return this.message$.asObservable();
  }
}
