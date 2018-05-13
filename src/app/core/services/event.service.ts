import { Injectable } from '@angular/core';
import { createEvent, EventType, MonsterEvents } from '@app/model';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class EventService {

  constructor(
    private dbService: DbService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {}

  add(data: any) {
    this.loadingService.isLoading();
    const event = createEvent(data);
    fromPromise(this.dbService.getDB()
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
