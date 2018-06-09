import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppHeaderService {
  private data$ = new Subject<any>();
  private search$ = new Subject<boolean>();

  sendData(data: any) {
    this.data$.next(data);
  }
  getData(): Observable<any> {
    return this.data$.asObservable();
  }

  getSearchStatus() {
    return this.search$.asObservable();
  }
  showSearch() {
    this.search$.next(true);
  }
  hideSearch() {
    this.search$.next(false);
  }
}
