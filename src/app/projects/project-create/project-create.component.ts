import { Component, EventEmitter, Output } from '@angular/core';
import { ProjectService } from '@app/core';
import { now, Project, Subproject } from '@app/model';
import { InputControl } from '@app/shared';
import { addDays } from 'date-fns';

@Component({
  selector: 'mst-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent {
  @Output() create = new EventEmitter<Project>();
  isShow = false;

  titleControl = new InputControl('');
  resultControl = new InputControl('');

  hasTitleError = false;
  hasResultError = false;

  startDate = now();
  endDate = addDays(this.startDate, 1).getTime();
  endDateStartDate = addDays(this.startDate, 1).getTime();

  subprojects: Subproject[] = [];

  constructor(private projectService: ProjectService) { }

  onOpen() {
    this.isShow = true;
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
      const project = this.projectService.createProject({ title, result, startDate: this.startDate, endDate: this.endDate });
      this.create.emit(project);
      this.isShow = false;
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
