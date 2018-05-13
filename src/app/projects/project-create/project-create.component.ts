import { Component, EventEmitter, Output } from '@angular/core';
import { ProjectService } from '@app/core';
import { now, ProjectStatus, TimeRangeType } from '@app/model';
import { DatepickerResult, InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { addDays } from 'date-fns';

@Component({
  selector: 'mst-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent extends Unsub {
  @Output() created = new EventEmitter<boolean>();
  isShow = false;

  titleControl = new InputControl('');
  resultControl = new InputControl('');

  hasTitleError = false;
  hasResultError = false;

  status: ProjectStatus;
  startDate = now();
  endDateStartDate = addDays(this.startDate, 1).getTime();
  endDate = this.endDateStartDate;

  TimeRangeType = TimeRangeType;

  constructor(private projectService: ProjectService) {
    super();
  }

  onOpen() {
    this.isShow = true;
  }
  onSelectStatus(status: ProjectStatus) {
    this.status = status;
  }
  onPickStartDate(result: DatepickerResult) {
    this.startDate = result.date;
    this.endDateStartDate = addDays(this.startDate, 1).getTime();
    if (this.startDate > this.endDate) {
      this.endDate = addDays(this.startDate, 1).getTime();
    }
  }
  onPickEndDate(result: DatepickerResult) {
    this.endDate = result.date;
  }
  onFinish() {
    const title = this.titleControl.getValue();
    const result = this.resultControl.getValue();
    if (title && result) {
      this.hasResultError = false;
      this.hasTitleError = false;
      this.addSubscription(
        this.projectService.addProject({
          title, result,
          startDate: this.startDate,
          endDate: this.endDate,
          status: this.status === undefined ? ProjectStatus.InProgress : this.status
        }).subscribe(success => {
          if (success) {
            this.isShow = false;
            this.created.emit(true);
            this.reset();
          }
        })
      );
    } else {
      this.hasTitleError = !title;
      this.hasResultError = !result;
    }
  }
  onCancel() {
    this.isShow = false;
    this.reset();
  }

  private reset() {
    this.titleControl.setValue('');
    this.resultControl.setValue('');
    this.hasTitleError = false;
    this.hasResultError = false;
    this.status = ProjectStatus.InProgress;
    this.startDate = now();
    this.endDate = this.endDateStartDate;
  }
}
