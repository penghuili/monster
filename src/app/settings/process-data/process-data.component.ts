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
  inProgressText: string;
  doneRecentlyText: string;
  projectsText: string;

  constructor(
    private notificationService: NotificationService,
    private projectService: ProjectService,
    private todoService: TodoService) {
  }

  ngOnInit() {
    this.inProgressText = JSON.stringify(MonsterStorage.get('in-progress'));
    this.doneRecentlyText = JSON.stringify(MonsterStorage.get('done-recently'));
    this.projectsText = JSON.stringify(MonsterStorage.get('projects'));
  }

  onCopyInProgress(isSuccess: boolean) {
    const message = isSuccess ? 'success :>' : 'failded ;)';
    this.notificationService.sendMessage('CopyInProgress ' + message);
  }
  onCopyDoneRecently(isSuccess: boolean) {
    const message = isSuccess ? 'success :>' : 'failded ;)';
    this.notificationService.sendMessage('CopyDoneRecently ' + message);
  }
  onCopyProjects(isSuccess: boolean) {
    const message = isSuccess ? 'success :>' : 'failded ;)';
    this.notificationService.sendMessage('CopyProjects ' + message);
  }

  onDeleteInProgress() {
    this.todoService.updateInProgress([]);
    this.notificationService.sendMessage('DeleteInProgress success :>');
  }
  onDeleteDoneRecently() {
    this.todoService.updateDoneRecently([]);
    this.notificationService.sendMessage('DeleteDoneRecently success :>');
  }
  onDeleteProjects() {
    this.projectService.updateProjects([]);
    this.notificationService.sendMessage('DeleteProjects success :>');
  }

  onProcessTodo() {
    this.todoService.process();
  }
}
