import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { debounceTime, filter } from 'rxjs/operators';

import { TodoService } from '../../../core/services/todo.service';
import { DatepickerResult } from '../../datepicker/model';
import { InputControl } from '../../input/input-control';

@Component({
  selector: 'mst-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss']
})
export class TodoCreateComponent extends Unsub implements OnInit {
  @Input() subproject: Subproject;
  @Input() useActionButton = false;
  @Input() plusColor = 'primary';
  @Output() created = new EventEmitter<boolean>();
  isShow = false;

  titleControl = new InputControl<string>({ required: true });
  noteControl = new InputControl<string>();
  status: TodoStatus;
  happenDate: number;
  expectedTime = 0;
  hasSubprojectError = false;

  isTodayStarted: boolean;
  showUnhappy: boolean;
  enableToday: boolean;
  defaultDatepickerDate: number;
  datePickerStartDate: number;
  datePickerEndDate: number;
  TimeRangeType = TimeRangeType;

  currentProject: Project;
  currentSubproject: Subproject;

  constructor(private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    this.setDatepickerWithToday();

    this.addSubscription(
      this.noteControl.value$.pipe(
        filter(() => this.isTodayStarted),
        debounceTime(300)
      ).subscribe(note => {
        this.showUnhappy = note.indexOf('i should not do this.') > -1;
      })
    );
  }

  onOpen() {
    this.isShow = true;
  }
  onSelectSubproject(selected: ProjectWithSubproject) {
    this.currentProject = selected.project;
    this.currentSubproject = selected.subproject;

    this.setDatepickerWithProject(selected.project);
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
    this.expectedTime = duration * 60;
  }
  onCreate() {
    const note = this.noteControl.getValue();
    const subproject = this.subproject || this.currentSubproject;
    if (this.titleControl.valid && subproject) {
      this.hasSubprojectError = false;
      const todo = {
        title: this.titleControl.getValue(),
        note,
        subprojectId: subproject.id,
        status: this.status === undefined ? TodoStatus.InProgress : this.status,
        expectedTime: this.expectedTime,
        happenDate: this.happenDate,
        addedLater: this.enableToday
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
      this.hasSubprojectError = !subproject;
    }
  }
  onCancel() {
    this.isShow = false;
    this.reset();
  }
  onEnableToday() {
    this.enableToday = !this.enableToday;
    if (this.enableToday) {
      this.datePickerStartDate = now();
    } else {
      this.datePickerStartDate = addDays(now(), 1).getTime();
    }
    this.defaultDatepickerDate = this.datePickerStartDate;
    this.happenDate = this.defaultDatepickerDate;
  }

  private setDatepickerWithToday() {
    this.isTodayStarted = isTodayStarted();
    this.datePickerStartDate = this.isTodayStarted ? addDays(now(), 1).getTime() : now();
    this.defaultDatepickerDate = this.datePickerStartDate;
    this.happenDate = this.datePickerStartDate;
  }
  private setDatepickerWithProject(project: Project) {
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
    this.titleControl.reset();
    this.noteControl.reset();
    this.setDatepickerWithToday();
    this.showUnhappy = false;
    this.enableToday = false;
    this.status = TodoStatus.InProgress;
    this.expectedTime = 0;
    this.hasSubprojectError = false;
    this.currentProject = null;
    this.currentSubproject = null;
  }
}
