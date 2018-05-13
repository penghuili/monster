import { Component, OnInit } from '@angular/core';
import { DbService, NotificationService, ProjectService, ReportService, TodoService } from '@app/core';
import { MonsterStorage } from '@app/model';

@Component({
  selector: 'mst-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.scss']
})
export class ProcessDataComponent implements OnInit {
  todosText: string;
  projectsText: string;
  subprojectsText: string;

  constructor(
    private dbService: DbService,
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private reportService: ReportService,
    private todoService: TodoService) {
  }

  ngOnInit() {
    this.todosText = JSON.stringify(MonsterStorage.get('todos'));
    this.projectsText = JSON.stringify(MonsterStorage.get('projects'));
    this.subprojectsText = JSON.stringify(MonsterStorage.get('sub-projects'));
  }

  onCopyTodos(isSuccess: boolean) {
    const message = isSuccess ? 'success :>' : 'failded ;)';
    this.notificationService.sendMessage('Copy todos ' + message);
  }
  onCopyProjects(isSuccess: boolean) {
    const message = isSuccess ? 'success :>' : 'failded ;)';
    this.notificationService.sendMessage('CopyProjects ' + message);
  }
  onCopySubprojects(isSuccess: boolean) {
    const message = isSuccess ? 'success :>' : 'failded ;)';
    this.notificationService.sendMessage('Copy Subprojects ' + message);
  }

  onProcess() {
    this.todoService.addUsedTimeToAllTodos();
  }
}
