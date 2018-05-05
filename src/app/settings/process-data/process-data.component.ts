import { Component, OnInit } from '@angular/core';
import { ProjectService, TodoService } from '@app/core';
import { MonsterStorage } from '@app/model';
import { NotificationService } from '@app/shared';

@Component({
  selector: 'mst-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.scss']
})
export class ProcessDataComponent implements OnInit {
  todosText: string;
  projectsText: string;

  constructor(
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private todoService: TodoService) {
  }

  ngOnInit() {
    this.todosText = JSON.stringify(MonsterStorage.get('todos'));
    this.projectsText = JSON.stringify(MonsterStorage.get('projects'));
  }

  onCopyTodos(isSuccess: boolean) {
    const message = isSuccess ? 'success :>' : 'failded ;)';
    this.notificationService.sendMessage('Copy todos ' + message);
  }
  onCopyProjects(isSuccess: boolean) {
    const message = isSuccess ? 'success :>' : 'failded ;)';
    this.notificationService.sendMessage('CopyProjects ' + message);
  }

  onDeleteTodos() {
    MonsterStorage.remove('todos');
    MonsterStorage.remove('in-progress');
    MonsterStorage.remove('done-recently');
    this.notificationService.sendMessage('Delete todos success :>');
  }
  onDeleteProjects() {
    this.projectService.updateProjects([]);
    this.notificationService.sendMessage('DeleteProjects success :>');
  }
}
