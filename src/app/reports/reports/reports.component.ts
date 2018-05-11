import { Component, OnInit } from '@angular/core';
import { TodoService } from '@app/core';
import { createReport, now, Report, Todo } from '@app/model';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends Unsub implements OnInit {

  todos: Todo[];
  report: Report;
  datePickerStartDate = now();

  constructor(private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.todoService.getForReports(now()).subscribe(todos => {
        this.todos = todos;
        this.report = createReport(this.todos);
        console.log(this.report)
      })
    );
  }

  onPickDate(date: number) {

  }

}
