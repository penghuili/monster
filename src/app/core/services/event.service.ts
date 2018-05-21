import { Injectable } from '@angular/core';
import { createEvent, Event, EventType } from '@app/model';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class EventService {

  constructor(
    private dbService: DbService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {}

  getEventsByTodoId(id: number): Observable<Event[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().events
      .filter(a => a.refId === id && a.type === EventType.Todo)
      .reverse()
      .toArray()
    ).pipe(
      catchError(error => {
        this.notificationService.sendMessage('add event fails.');
        return of(null);
      }),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  add(data: any): Observable<any> {
    this.loadingService.isLoading();
    const event = createEvent(data);
    return fromPromise(this.dbService.getDB()
      .events
      .add(event)
    ).pipe(
      catchError(error => {
        this.notificationService.sendMessage('add event fails.');
        return of(null);
      }),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }

}
