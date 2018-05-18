import { Injectable } from '@angular/core';
import { Habit } from '@app/model';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class HabitService {

  constructor(
    private dbService: DbService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) { }

  getHabits(): Observable<Habit[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().habits.toArray()
    ).pipe(
      catchError(error => this.handleError('getHabits fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  add(habit: Habit): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().habits.add(habit)
    ).pipe(
      catchError(error => this.handleError('add habit fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
