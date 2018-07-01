import { Component, EventEmitter, Input, Output } from '@angular/core';
import { now, ProjectStatus, TimeRangeType } from '@app/model';
import { Unsub } from '@app/static';
import { addDays } from 'date-fns';

import { ProjectService } from '../../../core/services/project.service';
import { DatepickerResult } from '../../datepicker/model';
import { InputControl } from '../../input/input-control';

@Component({
  selector: 'mst-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent extends Unsub {
  @Input() useActionButton = true;
  @Input() plusColor = 'primary';
  @Output() created = new EventEmitter<boolean>();
  isShow = false;

  titleControl = new InputControl<string>({ required: true });
  resultControl = new InputControl<string>({ required: true });

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
    if (this.titleControl.valid && this.resultControl.valid) {
      this.addSubscription(
        this.projectService.addProject({
          title: this.titleControl.getValue(),
          result: this.resultControl.getValue(),
          startDate: this.startDate,
          endDate: this.endDate,
          status: this.status === undefined ? ProjectStatus.Someday : this.status
        }).subscribe(success => {
          if (success) {
            this.isShow = false;
            this.created.emit(true);
            this.reset();
          }
        })
      );
    }
  }
  onCancel() {
    this.isShow = false;
    this.reset();
  }

  private reset() {
    this.titleControl.reset();
    this.resultControl.reset();
    this.status = ProjectStatus.InProgress;
    this.startDate = now();
    this.endDate = this.endDateStartDate;
  }
}
