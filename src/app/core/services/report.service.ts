import { Injectable } from '@angular/core';
import {
  createReport,
  EventType,
  getStartEnd,
  isDayOrBefore,
  isValidTodoWithin,
  now,
  Report,
  ReportWithTodos,
  TimeRangeType,
  Todo,
  TodoStatus,
} from '@app/model';
import { isToday } from 'date-fns';
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
import { SubprojectService } from './subproject.service';
import { ThoughtService } from './thought.service';
import { TodoService } from './todo.service';

@Injectable()
export class ReportService {

  constructor(
    private dbService: DbService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private thoughtService: ThoughtService,
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

    return combineLatest(todos$, report$).pipe(
      switchMap(([todos, oldReport]) => {
        let newReport: Report;
        if (oldReport) {
          newReport = merge(createReport(date, mode, todos), {
            id: oldReport.id,
            date: oldReport.date,
            usedTimeOfTimeRange: oldReport.usedTimeOfTimeRange
          });
        } else {
          newReport = createReport(date, mode, todos);
        }
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
  getReportsBefore(date?: number, mode?: TimeRangeType): Observable<Report[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().reports
        .filter(a => (date ? isDayOrBefore(a.date, date) : true) &&
          (mode === undefined ? true : a.type === mode))
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
          const thoughtIds = uniq(activities.filter(a => a.type === EventType.Thought).map(a => a.refId));
          return combineLatest(
            this.projectService.getProjectsByIds(projectIds),
            this.subprojectService.getSubprojectsByIds(subprojectIds),
            this.todoService.getTodosByIds(todoIds),
            this.thoughtService.getRecordsByIds(thoughtIds)
          ).pipe(
            map(([projects, subprojects, todos, thoughts]) => {
              return { activities, projects, subprojects, todos, thoughts };
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
  updateTodayUsedTime(usedTime: number): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().reports
      .filter(a => isToday(a.date) && a.type === TimeRangeType.Day)
      .first()
    ).pipe(
      switchMap(report => {
        if (report) {
          const usedTimeOfTimeRange = report.usedTimeOfTimeRange ? report.usedTimeOfTimeRange : 0;
          report = merge(report, {usedTimeOfTimeRange: usedTimeOfTimeRange + usedTime});
          return this.update(report);
        } else {
          report = {
            type: TimeRangeType.Day,
            date: now(),
            planned: undefined,
            done: undefined,
            doneOfCurrentRange: undefined,
            wontDo: undefined,
            wontDoOfCurrentRange: undefined,
            finishTooLate: undefined,
            finishTooEarly: undefined,
            addedLater: undefined,
            beforeToday: undefined,
            plannedTime: undefined,
            usedTimeOfTimeRange: usedTime
          };
          return this.create(report);
        }
      }),
      catchError(error => this.handleError('updateTodayUsedTime fails.')),
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
        .filter(x => isValidTodoWithin(x, start, end) && x.status !== TodoStatus.Someday)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getTodosForDailyReport fails.')),
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
