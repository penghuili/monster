import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/core';
import { createReport, isFinishTooEarly, isFinishTooLate, now, Report, Todo, TodoStatus } from '@app/model';
import { Unsub } from '@app/static';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'mst-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends Unsub implements OnInit {
  report: Report;
  todos: Todo[] = [];
  notFinished: Todo[] = [];
  finishTooLate: Todo[] = [];
  finishTooEarly: Todo[] = [];
  wontDo: Todo[] = [];
  done: Todo[] = [];

  date = now();
  datePickerStartDate = now();
  isLoading = true;

  constructor(private reportService: ReportService) {
    super();
  }

  ngOnInit() {
    this.getTodosAndReport(this.date);

    this.addSubscription(
      this.reportService.getReportStartDate().subscribe(startDate => {
        this.datePickerStartDate = startDate;
      })
    );
  }

  onPickDate(date: number) {
    this.date = date;
    this.report = null;
    this.todos = [];
    this.notFinished = [];
    this.finishTooLate = [];
    this.finishTooEarly = [];
    this.wontDo = [];
    this.done = [];
    this.getTodosAndReport(date);
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

  private getTodosAndReport(date: number) {
    this.isLoading = true;
    this.addSubscription(
      this.reportService.getTodosForDailyReport(date).pipe(
        switchMap(todos => {
          this.todos = todos;
          if (this.todos) {
            this.notFinished = this.todos.filter(a => a.status === TodoStatus.InProgress || a.status === TodoStatus.Waiting);
            this.finishTooLate = this.todos.filter(a => isFinishTooLate(a));
            this.finishTooEarly = this.todos.filter(a => isFinishTooEarly(a));
            this.wontDo = this.todos.filter(a => a.status === TodoStatus.WontDo);
            this.done = this.todos.filter(a => a.status === TodoStatus.Done);
          }
          return this.reportService.getReport(date);
        })
      ).subscribe(report => {
        this.isLoading = false;
        if (report) {
          this.report = report;
        } else {
          this.report = createReport(this.todos);
        }
      })
    );
  }

}
