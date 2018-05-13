import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '@app/core';
import { createReport, isFinishTooEarly, isFinishTooLate, Report, TimeRangeType, Todo, TodoStatus } from '@app/model';
import { ROUTES, Unsub } from '@app/static';
import { merge } from 'ramda';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'mst-report-stats',
  templateUrl: './report-stats.component.html',
  styleUrls: ['./report-stats.component.scss']
})
export class ReportStatsComponent extends Unsub implements OnChanges {
  @Input() date: number;
  @Input() mode: TimeRangeType;
  report: Report;
  todos: Todo[] = [];
  notFinished: Todo[] = [];
  finishTooLate: Todo[] = [];
  finishTooEarly: Todo[] = [];
  wontDo: Todo[] = [];
  done: Todo[] = [];
  usedTimeOfSelected = 0;

  isLoading = true;

  private _date: number;

  constructor(
    private reportService: ReportService,
    private router: Router) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['date'] || changes['mode']) {
      if (this.date && this.mode !== undefined) {
        this.report = null;
        this.todos = [];
        this.notFinished = [];
        this.finishTooLate = [];
        this.finishTooEarly = [];
        this.wontDo = [];
        this.done = [];
        this.getTodosAndReport(this.date, this.mode);
      }
    }
  }
  finishedPlanned() {
    return this.report.planned ? (this.report.done + this.report.wontDo) / this.report.planned : 0;
  }
  usedTimePlannedTime() {
    return this.report.plannedTime ? this.report.usedTime / this.report.plannedTime : 0;
  }
  finishedUsedTimeFinishedPlannedTime() {
    return this.report.finishedPlannedTime ? this.report.finishedUsedTime / this.report.finishedPlannedTime : 0;
  }
  getTodosRatio(todos: Todo[]): number {
    return this.todos.length ? todos.length / this.todos.length : 0;
  }
  onGotoTodo(id: number) {
    this.router.navigateByUrl(`/${ROUTES.TODOS}/${id}`);
  }

  private getTodosAndReport(date: number, mode: TimeRangeType) {
    this.isLoading = true;
    this.addSubscription(
      this.reportService.getTodosForReport(date, mode).pipe(
        switchMap(todos => {
          this.todos = todos;
          if (this.todos) {
            this.notFinished = this.todos.filter(a => a.status === TodoStatus.InProgress || a.status === TodoStatus.Waiting);
            this.finishTooLate = this.todos.filter(a => isFinishTooLate(a));
            this.finishTooEarly = this.todos.filter(a => isFinishTooEarly(a));
            this.wontDo = this.todos.filter(a => a.status === TodoStatus.WontDo);
            this.done = this.todos.filter(a => a.status === TodoStatus.Done);
          }
          return this.reportService.getReport(date, mode);
        })
      ).subscribe(report => {
        this.isLoading = false;
        this.report = createReport(this.todos, date, mode);
        if (report) {
          const merged = merge(report, this.report);
          this.reportService.update(merged).subscribe();
        } else {
          this.reportService.create(this.report).subscribe();
        }
      })
    );

    this.addSubscription(
      this.reportService.getUsedTime(date, mode).subscribe(time => {
        this.usedTimeOfSelected = time;
      })
    );
  }
}
