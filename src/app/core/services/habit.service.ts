import { Injectable } from '@angular/core';
import {
  EventType,
  Habit,
  HabitWithProgress,
  isWithin,
  isWithinDay,
  isWithinWeek,
  mapWeekDay,
  MonsterEvents,
  now,
  prepareRepostionIds,
  repositionItems,
  startOfWeek,
} from '@app/model';
import { addDays, addWeeks, differenceInCalendarWeeks, isToday } from 'date-fns';
import { find, merge } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, switchMap, tap } from 'rxjs/operators';

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
    const transaction = db.transaction('r', db.habits, db.events, () => {
      return db.habits
      .filter(x => isWithin(now(), x.startDate, x.endDate) && x[mapWeekDay(now())])
      .toArray()
      .then(hs => {
        habits = hs;
        return db.events
        .filter(a => {
          return isToday(a.createdAt) && a.type === EventType.Habit && a.action === MonsterEvents.FinishHabit;
        })
        .toArray();
      })
      .then(es => {
        return habits.map(a => {
          const e = find(x => x.refId === a.id, es);
          if (e) {
            a.doneForToday = true;
          }
          return a;
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
  getById(id: number): Observable<HabitWithProgress> {
    this.loadingService.isLoading();
    let habit: Habit;
    const db = this.dbService.getDB();
    const transaction = db.transaction('r', db.habits, db.events, () => {
      return db.habits
      .where('id')
      .equals(id)
      .first()
      .then(h => {
        habit = h;
        return db.events
        .filter(a => {
          return a.type === EventType.Habit && a.refId === id && a.action === MonsterEvents.FinishHabit;
        })
        .toArray();
      })
      .then(es => {
        if (habit) {
          es = es || [];
          const len = es.length;
          const last = es[len - 1];
          if (last && isToday(last.createdAt)) {
            habit.doneForToday = true;
          } else {
            habit.doneForToday = false;
          }

          const weeks = differenceInCalendarWeeks(
            startOfWeek(habit.endDate),
            startOfWeek(habit.startDate),
            {weekStartsOn: 1}
          ) + 1;
          const progress = Array(weeks).fill(1).map((a, i) => {
            const start = addWeeks(startOfWeek(habit.startDate), i).getTime();
            return Array(7).fill(1).reduce((total, curr, index) => {
              const day = addDays(start, index).getTime();
              const weekDay = mapWeekDay(day);
              const doneEvent = find(b => isWithinDay(b.createdAt, day), es);
              const shouldDo = habit[weekDay];
              const done = doneEvent ? true :
                shouldDo && isWithinWeek(day, now()) && isWithin(day, habit.startDate, habit.endDate) ? false :
                undefined;
              return merge(total, { [weekDay]: done });
            }, {});
          });
          return { habit, progress };
        } else {
          return null;
        }
      });
    });
    return fromPromise(transaction).pipe(
      catchError(error => this.handleError('getHabit by id fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getHabitsByIds(ids: number[]): Observable<Habit[]> {
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
}
