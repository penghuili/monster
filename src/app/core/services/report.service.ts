import { Injectable } from '@angular/core';
import {
  calcUsedTime,
  createReport,
  EventType,
  getStartEnd,
  MonsterEvents,
  now,
  Report,
  ReportWithTodos,
  TimeRangeType,
  Todo,
  TodoStatus,
} from '@app/model';
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
import { RecordService } from './record.service';
import { SubprojectService } from './subproject.service';
import { TodoService } from './todo.service';

@Injectable()
export class ReportService {

  constructor(
    private dbService: DbService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private recordService: RecordService,
    private subprojectService: SubprojectService,
    private todoService: TodoService) { }

  getReportWithTodos(date: number, mode: TimeRangeType): Observable<ReportWithTodos> {
    this.loadingService.isLoading();
    let start: number;
    let end: number;
    [start, end] = getStartEnd(date, mode);

    let reportWithTodos: ReportWithTodos;
    const todos$ = this.getTodosForReport(date, mode);
    const report$ = this.getReport(date, mode);
    const usedTimeOfSelectedTimeRange$ = this.getUsedTimeOfTimeRange(date, mode);

    return combineLatest(todos$, report$, usedTimeOfSelectedTimeRange$).pipe(
      switchMap(([todos, oldReport, usedTimeOfTimeRange]) => {
        const newReport = merge(oldReport, createReport(date, mode, todos, usedTimeOfTimeRange));
        reportWithTodos = { report: newReport, todos };

        if (newReport && oldReport) {
          return this.update(newReport).pipe(
            map(() => reportWithTodos)
          );
        } else if (newReport && !oldReport) {
          return this.create(newReport).pipe(
            map(r => ({ report: r, todos }))
          );
        } else {
          return of(reportWithTodos);
        }
      })
    );
  }
  getReports(mode: TimeRangeType): Observable<Report[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().reports
        .where('type')
        .equals(mode)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getReports fails.')),
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
  getActivities(date: number, mode: TimeRangeType): Observable<any> {
    this.loadingService.isLoading();
    let start: number;
    let end: number;
    [start, end] = getStartEnd(date, mode);

    return fromPromise(
      this.dbService.getDB().events
        .where('createdAt')
        .between(start, end)
        .toArray()
    ).pipe(
      switchMap(activities => {
        if (activities && activities.length > 0) {
          const projectIds = uniq(activities.filter(a => a.type === EventType.Project).map(a => a.refId));
          const subprojectIds = uniq(activities.filter(a => a.type === EventType.Subproject).map(a => a.refId));
          const todoIds = uniq(activities.filter(a => a.type === EventType.Todo).map(a => a.refId));
          const recordIds = uniq(activities.filter(a => a.type === EventType.Record).map(a => a.refId));
          return combineLatest(
            this.projectService.getProjectsByIds(projectIds),
            this.subprojectService.getSubprojectsByIds(subprojectIds),
            this.todoService.getTodosByIds(todoIds),
            this.recordService.getRecordsByIds(recordIds)
          ).pipe(
            map(([projects, subprojects, todos, records]) => {
              return { activities, projects, subprojects, todos, records };
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
  update(report: Report): Observable<Report> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().reports.put(report)).pipe(
      map(id => merge(report, {id})),
      catchError(error => this.handleError('update report fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }


  renameCreatedAtAndAddType() {
    this.loadingService.isLoading();
    fromPromise(this.dbService.getDB().reports.toArray()).subscribe(reports => {
      reports = reports.map(r => {
        r.date = (<any>r).createdAt;
        r.type = TimeRangeType.Day;
        delete (<any>r).createdAt;
        return r;
      });
      this.dbService.getDB().reports.bulkPut(reports).then(() => {
        this.loadingService.stopLoading();
      });
    });
  }
  private getReport(date: number, mode: TimeRangeType): Observable<Report> {
    this.loadingService.isLoading();
    let start: number;
    let end: number;
    [start, end] = getStartEnd(date, mode);

    return fromPromise(
      this.dbService.getDB().reports
        .filter(x => x.type === mode && x.date > start && x.date < end)
        .first()
    ).pipe(
      catchError(error => this.handleError('getReport fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  private getTodosForReport(date: number, mode: TimeRangeType): Observable<Todo[]> {
    this.loadingService.isLoading();
    let start: number;
    let end: number;
    [start, end] = getStartEnd(date, mode);

    return fromPromise(
      this.dbService.getDB().todos
        .filter(x => {
          return ((x.happenDate > start && x.happenDate < end) ||
            (x.happenDate < start && (!x.finishAt || x.finishAt > end)) ||
            (x.finishAt > start && x.finishAt < end)) && x.status !== TodoStatus.Someday;
        })
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getTodosForDailyReport fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  private getUsedTimeOfTimeRange(date: number, mode: TimeRangeType, todoId?: number): Observable<number> {
    this.loadingService.isLoading();
    let start: number;
    let end: number;
    [start, end] = getStartEnd(date, mode);

    return fromPromise(
      this.dbService.getDB().events
        .filter(x => x.createdAt > start && x.createdAt < end &&
          (x.action === MonsterEvents.StartTodo || x.action === MonsterEvents.StopTodo) &&
          (todoId ? x.refId === todoId : true)
        )
        .toArray()
    ).pipe(
      map(events => calcUsedTime(events, todoId)),
      catchError(error => {
        this.notificationService.sendMessage('getUsedTime failed');
        return of(0);
      }),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  private create(report: Report): Observable<Report> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().reports.add(report)).pipe(
      map(id => merge(report, {id})),
      catchError(error => this.handleError('create report fails.')),
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
