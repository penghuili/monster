import { Injectable } from '@angular/core';
import { EventType, getStartEnd, isWithin, MonsterEvents, now, Thought, TimeRangeType } from '@app/model';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { EventService } from './event.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class ThoughtService {
  constructor(
    private dbService: DbService,
    private eventService: EventService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {}

  getRecords(date: number, mode: TimeRangeType): Observable<Thought[]> {
    this.loadingService.isLoading();
    const [start, end] = getStartEnd(date, mode);

    return fromPromise(
      this.dbService.getDB().records
        .filter(a => isWithin(a.createdAt, start, end))
        .reverse()
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getRecordsByDay fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getRecordsByIds(ids: number[]): Observable<Thought[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().records
        .where('id')
        .anyOf(ids)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getRecordsByIds fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getRecordStartDate(): Observable<number> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().records.limit(1).first()
    ).pipe(
      map(firstRecord => firstRecord ? firstRecord.createdAt : now()),
      catchError(error => {
        this.notificationService.sendMessage('get report start date fails, use today');
        return of(now());
      }),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  add(record: Thought): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().records.add(record)
    ).pipe(
      catchError(error => this.handleError('add record fails.')),
      tap(id => {
        this.loadingService.stopLoading();
        if (id) {
          this.eventService.add({
            refId: id,
            type: EventType.Thought,
            action: MonsterEvents.CreateRecord
          }).subscribe();
        }
      })
    );
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
