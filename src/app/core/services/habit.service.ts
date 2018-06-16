import { Injectable } from '@angular/core';
import { Habit, HabitWithItems, isWithin, mapWeekDay, now, prepareRepostionIds, repositionItems } from '@app/model';
import { isToday } from 'date-fns';
import { find } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

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
  getTodaysHabits(): Observable<Habit[]> {
    this.loadingService.isLoading();
    let habits: Habit[];
    const db = this.dbService.getDB();
    const transaction = db.transaction('r', db.habits, db.habitItems, () => {
      return db.habits
      .filter(x => isWithin(now(), x.startDate, x.endDate) && x[mapWeekDay(now())])
      .toArray()
      .then(hs => {
        habits = hs;
        return db.habitItems
        .filter(a => isToday(a.happenDate))
        .toArray();
      })
      .then(items => {
        return habits.map(h => {
          const e = find(i => i.habitId === h.id, items);
          if (e) {
            h.doneForToday = true;
          }
          return h;
        });
      });
    });
    return fromPromise(transaction).pipe(
      catchError(error => this.handleError('get todays Habits fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getHabitWithItems(id: number): Observable<HabitWithItems> {
    this.loadingService.isLoading();
    const db = this.dbService.getDB();
    const transaction = db.transaction('r', db.habits, db.habitItems, () => {
      const habitP = db.habits
        .where('id')
        .equals(id)
        .first();
      const itemsP = db.habitItems
        .filter(a => a.habitId === id)
        .toArray();

      return Promise.all([habitP, itemsP]);
    });
    return fromPromise(transaction).pipe(
      map(([habit, items]) => ({ habit, items })),
      catchError(() => this.handleError('getHabitWithItems fails')),
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
  update(habit: Habit): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().habits.put(habit)
    ).pipe(
      catchError(error => this.handleError('update habit fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  updateHabits(habits: Habit[]): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().habits.bulkPut(habits)
    ).pipe(
      catchError(error => this.handleError('updateHabits fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  repositionHabits(dragged: Habit, dropped: Habit): Observable<any> {
    const ids = prepareRepostionIds(dragged, dropped);

    return this.getHabitsByIds(ids).pipe(
      switchMap(hs => {
        if (hs) {
          hs.unshift(dropped);
          hs.unshift(dragged);
          const repositioned = <Habit[]>repositionItems(hs);
          return this.updateHabits(repositioned);
        } else {
          return of(null);
        }
      })
    );
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
  private getHabitsByIds(ids: number[]): Observable<Habit[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().habits
        .where('id')
        .anyOf(ids)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getHabitsByIds fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
}
