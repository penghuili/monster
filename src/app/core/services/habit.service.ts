import { Injectable } from '@angular/core';
import {
  EventType,
  Habit,
  HabitItem,
  HabitWithItems,
  isWithin,
  mapWeekDay,
  MonsterEvents,
  now,
  prepareRepostionIds,
  repositionItems,
} from '@app/model';
import { isToday } from 'date-fns';
import { find, merge } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { EventService } from './event.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class HabitService {

  constructor(
    private dbService: DbService,
    private eventService: EventService,
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
      map(([habit, items]) => {
        const last = items[items.length - 1];
        habit = merge(habit, {doneForToday: last ? isToday(last.happenDate) : false});
        return { habit, items };
      }),
      catchError(() => this.handleError('getHabitWithItems fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getHabitsWithIds(ids: number[]): Observable<Habit[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().habits
        .where('id')
        .anyOf(ids)
        .toArray()
    ).pipe(
      catchError(() => this.handleError('getHabitsWithIds fails')),
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
  finishHabitItem(habitItem: HabitItem): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().habitItems.add(habitItem)
    ).pipe(
      catchError(error => this.handleError('finishHabitItem fails')),
      tap(success => {
        this.loadingService.stopLoading();
        if (success) {
          this.eventService.add({
            createdAt: now(),
            type: EventType.Habit,
            refId: habitItem.habitId,
            action: MonsterEvents.FinishHabit
          }).subscribe();
        }
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
