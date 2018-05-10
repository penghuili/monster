import { Component } from '@angular/core';
import { ProjectService } from '@app/core';
import { now, ProjectStatus, Subproject } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { addDays } from 'date-fns';

@Component({
  selector: 'mst-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent extends Unsub {
  isShow = false;

  titleControl = new InputControl('');
  resultControl = new InputControl('');

  hasTitleError = false;
  hasResultError = false;

  status: ProjectStatus;
  startDate = now();
  endDate = addDays(this.startDate, 1).getTime();
  endDateStartDate = addDays(this.startDate, 1).getTime();

  subprojects: Subproject[] = [];

  constructor(private projectService: ProjectService) {
    super();
  }

  onOpen() {
    this.isShow = true;
  }
  onSelectStatus(status: ProjectStatus) {
    this.status = status;
  }
  onPickStartDate(date: number) {
    this.startDate = date;
    this.endDateStartDate = addDays(this.startDate, 1).getTime();
    if (this.startDate > this.endDate) {
      this.endDate = addDays(this.startDate, 1).getTime();
    }
  }
  onPickEndDate(date: number) {
    this.endDate = date;
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
          this.isShow = false;
        })
      );
    } else {
      this.hasTitleError = !title;
      this.hasResultError = !result;
    }
  }
  onCancel() {
    this.isShow = false;
    this.hasResultError = false;
    this.hasTitleError = false;
  }
}
