import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoService } from '@app/core';
import { isTodayStarted, now, Subproject, TodoStatus } from '@app/model';
import { DatepickerMode } from '@app/shared';
import { Unsub } from '@app/static';
import { addDays } from 'date-fns';

import { InputControl } from '../../input/input-control';

@Component({
  selector: 'mst-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss']
})
export class TodoCreateComponent extends Unsub {
  @Input() subproject: Subproject;
  @Input() useActionButton = false;
  @Output() created = new EventEmitter<boolean>();
  isShow = false;

  titleControl = new InputControl('');
  noteControl = new InputControl('');
  status: TodoStatus;
  happenDate: number;
  expectedTime = 0;
  hasTitleError = false;
  hasSubprojectError = false;
  datePickerStartDate: number;
  DatepickerMode = DatepickerMode;

  currentSubproject: Subproject;

  constructor(private todoService: TodoService) {
    super();
    this.datePickerStartDate = isTodayStarted() ? addDays(now(), 1).getTime() : now();
    this.happenDate = this.datePickerStartDate;
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
            this.created.emit(true);
            this.reset();
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
    this.reset();
  }

  private reset() {
    this.titleControl.setValue('');
    this.noteControl.setValue('');
    this.status = TodoStatus.InProgress;
    this.happenDate = this.datePickerStartDate;
    this.expectedTime = 0;
    this.hasTitleError = false;
    this.hasSubprojectError = false;
    this.currentSubproject = null;
  }
}
