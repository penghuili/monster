import { Component, Input } from '@angular/core';
import { TodoService } from '@app/core';
import { now, Subproject, TodoStatus } from '@app/model';
import { Unsub } from '@app/static';

import { InputControl } from '../../input/input-control';

@Component({
  selector: 'mst-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss']
})
export class TodoCreateComponent extends Unsub {
  @Input() subproject: Subproject;
  @Input() useActionButton = false;
  isShow = false;

  titleControl = new InputControl('');
  noteControl = new InputControl('');
  status: TodoStatus;
  happenDate = now();
  expectedTime = 0;
  hasTitleError = false;
  hasSubprojectError = false;

  currentSubproject: Subproject;

  constructor(private todoService: TodoService) {
    super();
  }

  onOpen() {
    this.isShow = true;
  }
  onSelectSubproject(project: Subproject) {
    this.currentSubproject = project;
  }
  onSelectStatus(status: TodoStatus) {
    this.status = status;
  }
  onFinishPickDate(date: number) {
    this.happenDate = date;
  }
  onDurationChange(duration: number) {
    this.expectedTime = duration;
  }
  onCreate() {
    const title = this.titleControl.getValue();
    const note = this.noteControl.getValue();
    const subproject = this.subproject || this.currentSubproject;
    if (title && subproject) {
      this.hasTitleError = false;
      this.hasSubprojectError = false;
      const todo = {
        title, note,
        subprojectId: subproject.id,
        status: this.status === undefined ? TodoStatus.InProgress : this.status,
        expectedTime: this.expectedTime,
        happenDate: this.happenDate
      };
      this.addSubscription(
        this.todoService.add(todo).subscribe(success => {
          if (success) {
            this.isShow = false;
          }
        })
      );
    } else {
      this.hasTitleError = !title;
      this.hasSubprojectError = !subproject;
    }
  }
  onCancel() {
    this.isShow = false;
  }
}
