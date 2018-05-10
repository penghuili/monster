import { Component, OnInit } from '@angular/core';
import { DbService, NotificationService, ProjectService, TodoService } from '@app/core';
import { Event, EventType, MonsterEvents, MonsterStorage, Project, Subproject, Todo, TodoStatus } from '@app/model';
import { combineLatest } from 'rxjs/observable/combineLatest';

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

  onProcessTodos() {
    this.todoService.process();
    this.notificationService.sendMessage('process todos success :>');
  }
  onProcessProjects() {
    this.projectService.processProjects();
    this.notificationService.sendMessage('process projects success :>');
  }
  onProcessSubprojects() {
    this.projectService.processSubprojects();
    this.notificationService.sendMessage('process subprojects success :>');
  }
}
