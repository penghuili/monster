import { Injectable } from '@angular/core';
import {
  createReport,
  EventType,
  isAfterToday,
  isBeforeToday,
  isWithinDay,
  now,
  Report,
  Todo,
  TodoStatus,
} from '@app/model';
import { endOfDay, format, startOfDay } from 'date-fns';
import { merge, uniq } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';
import { ProjectService } from './project.service';
import { TodoService } from './todo.service';

@Injectable()
export class ReportService {

  constructor(
    private dbService: DbService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private todoService: TodoService) { }

  getReport(date: number): Observable<Report> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().reports
        .filter(x => format(x.createdAt, 'YYYYMMDD') === format(date, 'YYYYMMDD'))
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
  getActivities(date: number): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().events
        .where('createdAt')
        .between(startOfDay(date).getTime(), endOfDay(date).getTime())
        .toArray()
    ).pipe(
      switchMap(activities => {
        if (activities && activities.length > 0) {
          const projectIds = uniq(activities.filter(a => a.type === EventType.Project).map(a => a.refId));
          const subprojectIds = uniq(activities.filter(a => a.type === EventType.Subproject).map(a => a.refId));
          const todoIds = uniq(activities.filter(a => a.type === EventType.Todo).map(a => a.refId));
          return combineLatest(
            this.projectService.getProjectsByIds(projectIds),
            this.projectService.getSubprojectsByIds(subprojectIds),
            this.todoService.getTodosByIds(todoIds)
          ).pipe(
            map(([projects, subprojects, todos]) => {
              return { activities, projects, subprojects, todos };
            })
          );
        } else {
          return of(null);
        }
      }),
      catchError(error => this.handleError('getActivities fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  create(report: Report): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().reports.add(report)).pipe(
      map(() => report),
      catchError(error => this.handleError('create report fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  update(report: Report): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().reports.put(report)).pipe(
      map(() => report),
      catchError(error => this.handleError('update report fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  createOrUpdateReport(date: number, data?: any): Observable<Report> {
    this.loadingService.isLoading();
    let newReport: Report;
    return this.getTodosForDailyReport(date).pipe(
      map(todos => {
        newReport = createReport(todos);
        if (data) {
          newReport = merge(newReport, data);
        }
        return newReport;
      }),
      switchMap(nr => nr ? this.getReport(date) : of(null)),
      switchMap(oldReport => {
        if (!newReport) {
          return of(null);
        } else if (!oldReport) {
          return this.create(newReport);
        } else {
          return this.update(merge(oldReport, newReport));
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
            isWithinDay(x.finishAt, date)) && x.status !== TodoStatus.Someday;
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
}
