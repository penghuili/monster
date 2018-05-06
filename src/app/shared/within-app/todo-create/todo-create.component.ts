import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoService } from '@app/core';
import { now, Subproject, Todo } from '@app/model';
import { INBOX } from '@app/static';

import { InputControl } from '../../input/input-control';

@Component({
  selector: 'mst-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss']
})
export class TodoCreateComponent {
  @Input() subproject: Subproject;
  @Input() useActionButton = false;
  @Output() newTodo = new EventEmitter<Todo>();
  isShow = false;

  titleControl = new InputControl('');
  noteControl = new InputControl('');
  happenDate = now();
  expectedTime = 0;
  hasError = false;

  currentProject: Subproject = <any>INBOX;
  INBOX = INBOX;

  constructor(private todoService: TodoService) {
  }

  onOpen() {
    this.isShow = true;
  }
  onSelectProject(project: Subproject) {
    this.currentProject = project;
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
    const expectedTime = this.expectedTime;
    const project = this.subproject || this.currentProject;
    const happenDate = this.happenDate;
    if (title) {
      this.hasError = false;
      const todo = { title, note, projectId: project.id, expectedTime, happenDate };
      const newTodo = this.todoService.create(todo);
      this.newTodo.emit(newTodo);
      this.isShow = false;
    } else {
      this.hasError = true;
    }
  }
  onCancel() {
    this.isShow = false;
  }
}
