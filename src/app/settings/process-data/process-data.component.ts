import { Component, OnInit } from '@angular/core';
import { DbService, NotificationService, ProjectService, ReportService, TodoService } from '@app/core';
import { MonsterStorage } from '@app/model';

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
  }
}
