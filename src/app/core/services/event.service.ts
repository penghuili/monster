import { Injectable } from '@angular/core';
import { createEvent, EventType, MonsterEvents } from '@app/model';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';

import { DbService } from './db.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class EventService {

  constructor(
    private dbService: DbService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {}

  getTodoUsedTime(todoId: number): Observable<number> {
    return fromPromise(this.dbService.getDB().events
      .filter(x => x.refId === todoId && x.type === EventType.Todo &&
        (x.action === MonsterEvents.StartTodo || x.action === MonsterEvents.StopTodo))
      .toArray()
    ).pipe(
      map(events => {
        const len = events ? events.length : 0;
        if (len < 2) {
          return 0;
        } else if (len % 2 === 1) {
          events.pop();
        }
        const starts = events.filter((a, i) => i % 2 === 0);
        const ends = events.filter((a, i) => i % 2 === 1);
        return starts.reduce((total, curr, index) => {
          return total + ends[index].createdAt - curr.createdAt;
        }, 0);
      }),
      catchError(error => {
        this.notificationService.sendMessage('get todo used time fails.');
        return of(null);
      })
    );
  }
  add(data: any) {
    this.loadingService.isLoading();
    const event = createEvent(data);
    return fromPromise(this.dbService.getDB()
      .events
      .add(event)
    ).pipe(
      catchError(error => {
        this.notificationService.sendMessage('add event fails.');
        return of(null);
      })
    ).subscribe(() => {
      this.loadingService.stopLoading();
    });
  }

}
