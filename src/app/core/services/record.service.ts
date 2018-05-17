import { Injectable } from '@angular/core';
import { EventType, isWithinDay, MonsterEvents, now, Record } from '@app/model';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { EventService } from './event.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class RecordService {
  constructor(
    private dbService: DbService,
    private eventService: EventService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {}

  getRecordsByDay(date: number): Observable<Record[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().records
        .filter(a => isWithinDay(a.createdAt, date))
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getRecordsByDay fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getRecordsByIds(ids: number[]): Observable<Record[]> {
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
  add(record: Record): Observable<any> {
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
            type: EventType.Record,
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
