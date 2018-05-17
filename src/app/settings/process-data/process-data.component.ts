import { Component } from '@angular/core';
import { DbService, NotificationService, ProjectService, ReportService, TodoService } from '@app/core';
import { merge } from 'ramda';
import { fromPromise } from 'rxjs/observable/fromPromise';

@Component({
  selector: 'mst-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.scss']
})
export class ProcessDataComponent {

  constructor(
    private dbService: DbService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private reportService: ReportService,
    private todoService: TodoService) {
  }


  onProcess() {
    fromPromise(this.dbService.getDB().todos.toArray()).subscribe(todos => {
      todos = todos.map(a => merge(a, { usedTime: a.usedTime * 60 }));
      this.dbService.getDB().todos.bulkPut(todos);
    });
  }
}
