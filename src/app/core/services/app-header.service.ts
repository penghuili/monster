import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppHeaderService {
  private data$ = new BehaviorSubject<any>(null);

  sendData(data: any) {
    this.data$.next(data);
  }
  getData(): Observable<any> {
    return this.data$.asObservable();
  }
}
