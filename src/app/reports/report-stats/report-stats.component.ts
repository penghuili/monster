import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '@app/core';
import { isFinishTooEarly, isFinishTooLate, Report, TimeRangeType, Todo, TodoStatus } from '@app/model';
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
  todos: Todo[] = [];
  notFinished: Todo[] = [];
  finishTooLate: Todo[] = [];
  finishTooEarly: Todo[] = [];
  wontDo: Todo[] = [];
  done: Todo[] = [];
  usedTimeOfTimeRange = 0;

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
      this.reportService.getReportWithTodos(date, mode).subscribe(reportWithTodos => {
        this.isLoading = false;
        this.todos = reportWithTodos.todos;
        this.report = reportWithTodos.report;
        this.usedTimeOfTimeRange = this.report ? this.report.usedTimeOfTimeRange : 0;
        if (this.todos) {
          this.notFinished = this.todos.filter(a => a.status === TodoStatus.InProgress || a.status === TodoStatus.Waiting);
          this.finishTooLate = this.todos.filter(a => isFinishTooLate(a));
          this.finishTooEarly = this.todos.filter(a => isFinishTooEarly(a));
          this.wontDo = this.todos.filter(a => a.status === TodoStatus.WontDo);
          this.done = this.todos.filter(a => a.status === TodoStatus.Done);
        }
      })
    );
  }
}
