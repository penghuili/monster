import { Injectable } from '@angular/core';
import { createReport, isAfterToday, isBeforeToday, isWithinDay, now, Report, Todo, TodoStatus } from '@app/model';
import { endOfDay, isToday, startOfDay } from 'date-fns';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class ReportService {

  constructor(
    private dbService: DbService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) { }

  getReport(date: number): Observable<Report> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().reports
        .where('createdAt')
        .between(startOfDay(date).getTime(), endOfDay(date).getTime())
        .first()
    ).pipe(
      catchError(error => this.handleError('getReport fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getReportStartDate(): Observable<number> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().todos.limit(1).first()
    ).pipe(
      map(firstTodo => firstTodo ? firstTodo.createdAt : now()),
      catchError(error => {
        this.notificationService.sendMessage('get report start date fails, use today');
        return of(now());
      }),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  createOrUpdateReport(date: number): Observable<Report> {
    this.loadingService.isLoading();
    let newReport: Report;
    return this.getTodosForDailyReport(date).pipe(
      map(todos => {
        newReport = createReport(todos);
        return newReport;
      }),
      switchMap(nr => nr ? this.getReport(date) : of(null)),
      switchMap(oldReport => {
        if (!newReport) {
          return of(null);
        } else if (!oldReport) {
          return this.create(newReport);
        } else {
          return this.update(newReport);
        }
      })
    );
  }
  getTodosForDailyReport(date: number): Observable<Todo[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().todos
        .filter(x => {
          return (isWithinDay(x.happenDate, date) ||
            (isBeforeToday(x.happenDate) && (!x.finishAt || isAfterToday(x.finishAt))) ||
            isToday(x.finishAt)) && x.status !== TodoStatus.Someday;
        })
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getTodosForDailyReport fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
  private create(report: Report): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().reports.add(report)).pipe(
      map(() => report),
      catchError(error => this.handleError('create report fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  private update(report: Report): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().reports.put(report)).pipe(
      map(() => report),
      catchError(error => this.handleError('update report fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
}
