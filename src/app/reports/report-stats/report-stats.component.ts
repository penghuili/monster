import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '@app/core';
import {
  getStartEnd,
  isFinishTooEarly,
  isFinishTooLate,
  isWithin,
  Report,
  TimeRangeType,
  Todo,
  TodoStatus,
} from '@app/model';
import { ROUTES, Unsub } from '@app/static';

@Component({
  selector: 'mst-report-stats',
  templateUrl: './report-stats.component.html',
  styleUrls: ['./report-stats.component.scss']
})
export class ReportStatsComponent extends Unsub implements OnChanges {
  @Input() date: number;
  @Input() mode: TimeRangeType;
  report: Report;
  notFinished: Todo[] = [];
  finishTooLate: Todo[] = [];
  finishTooEarly: Todo[] = [];
  addedLater: Todo[] = [];
  wontDo: Todo[] = [];
  done: Todo[] = [];

  isLoading = true;

  private todos: Todo[] = [];
  private todosWithinRange: Todo[] = [];
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
        this.todosWithinRange = [];
        this.notFinished = [];
        this.finishTooLate = [];
        this.finishTooEarly = [];
        this.addedLater = [];
        this.wontDo = [];
        this.done = [];
        this.getTodosAndReport(this.date, this.mode);
      }
    }
  }
  finishedCount() {
    return this.report.done !== undefined && this.report.wontDo !== undefined ? this.report.done + this.report.wontDo : 0;
  }
  finishedPlanned() {
    return this.report.planned ? this.finishedCount() / this.report.planned : 0;
  }
  usedTimePlannedTime() {
    return this.report.plannedTime ? this.report.usedTimeOfTimeRange / this.report.plannedTime : 0;
  }
  getTodosRatio(todos: Todo[]): number {
    return this.todosWithinRange.length ? todos.length / this.todosWithinRange.length : 0;
  }
  onGotoTodo(id: number) {
    this.router.navigateByUrl(`/${ROUTES.TODOS}/${id}`);
  }

  private getTodosAndReport(date: number, mode: TimeRangeType) {
    this.isLoading = true;

    const [start, end] = getStartEnd(date, mode);

    this.addSubscription(
      this.reportService.getReportWithTodos(date, mode).subscribe(reportWithTodos => {
        this.isLoading = false;
        this.todos = reportWithTodos.todos;
        this.todosWithinRange = this.todos ? this.todos.filter(a => isWithin(a.happenDate, start, end)) : [];
        this.report = reportWithTodos.report;
        if (this.todos) {
          this.notFinished = this.todosWithinRange.filter(a => !(
            isWithin(a.finishAt, start, end) &&
            (a.status === TodoStatus.Done || a.status === TodoStatus.WontDo)
          ));
          this.finishTooLate = this.todos.filter(a => isWithin(a.finishAt, start, end) && isFinishTooLate(a));
          this.finishTooEarly = this.todos.filter(a => isWithin(a.finishAt, start, end) && isFinishTooEarly(a));
          this.addedLater = this.todos.filter(a => a.addedLater);
          this.wontDo = this.todosWithinRange.filter(a => isWithin(a.finishAt, start, end) && a.status === TodoStatus.WontDo);
          this.done = this.todos.filter(a => isWithin(a.finishAt, start, end) && a.status === TodoStatus.Done);
        }
      })
    );
  }
}
