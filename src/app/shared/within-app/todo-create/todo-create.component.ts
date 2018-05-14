import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoService } from '@app/core';
import {
  isTodayStarted,
  isWithin,
  now,
  Project,
  ProjectWithSubproject,
  Subproject,
  TimeRangeType,
  TodoStatus,
} from '@app/model';
import { Unsub } from '@app/static';
import { addDays } from 'date-fns';

import { DatepickerResult } from '../../datepicker/model';
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

  defaultDatepickerDate: number;
  datePickerStartDate: number;
  datePickerEndDate: number;
  TimeRangeType = TimeRangeType;

  currentProject: Project;
  currentSubproject: Subproject;

  constructor(private todoService: TodoService) {
    super();
    this.datePickerStartDate = isTodayStarted() ? addDays(now(), 1).getTime() : now();
    this.defaultDatepickerDate = this.datePickerStartDate;
    this.happenDate = this.datePickerStartDate;
  }

  onOpen() {
    this.isShow = true;
  }
  onSelectSubproject(selected: ProjectWithSubproject) {
    this.currentProject = selected.project;
    this.currentSubproject = selected.subproject;

    this.setDatepickerRange(selected.project);
  }
  onSelectStatus(status: TodoStatus) {
    if (status === TodoStatus.Someday) {
      const twoWeeksLater = addDays(now(), 14).getTime();
      this.happenDate = this.happenDate && twoWeeksLater < this.happenDate ? this.happenDate : twoWeeksLater;
      this.defaultDatepickerDate = this.happenDate;
    } else if (this.status === TodoStatus.Someday && (status === TodoStatus.InProgress || status === TodoStatus.Waiting)) {
      this.happenDate = now();
      this.defaultDatepickerDate = this.happenDate;
    }
    this.status = status;
  }
  onFinishPickDate(result: DatepickerResult) {
    this.happenDate = result.date;
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

  private setDatepickerRange(project: Project) {
    this.datePickerStartDate = project && project.startDate > this.datePickerStartDate ? project.startDate : this.datePickerStartDate;
    this.datePickerEndDate = project ? project.endDate : undefined;

    if (project && this.happenDate &&
      (this.status === undefined || this.status !== TodoStatus.Someday) &&
      !isWithin(this.happenDate, project.startDate, project.endDate)) {
        this.happenDate = this.datePickerStartDate;
        alert(`your todo's date is out of project ${project.title}'s range. please reselect date.`);
    }
  }
  private reset() {
    this.titleControl.setValue('');
    this.noteControl.setValue('');
    this.status = TodoStatus.InProgress;
    this.happenDate = this.datePickerStartDate;
    this.expectedTime = 0;
    this.hasTitleError = false;
    this.hasSubprojectError = false;
    this.currentProject = null;
    this.currentSubproject = null;
  }
}
