import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectStatus } from '@app/model';
import { Unsub } from '@app/static';

import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'mst-project-status-picker',
  templateUrl: './project-status-picker.component.html',
  styleUrls: ['./project-status-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectStatusPickerComponent extends Unsub implements OnInit {
  @Input() set status(value: ProjectStatus) {
    this.outerStatus = value;
    this.innerStatus = value;
  }
  @Output() select = new EventEmitter<ProjectStatus>();
  isShow = false;
  ProjectStatus = ProjectStatus;
  innerStatus = ProjectStatus.Someday;
  showError: boolean;

  private outerStatus = ProjectStatus.Someday;
  private activeProjectsCount: number;

  constructor(private projectService: ProjectService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.projectService.getActiveProjects().subscribe(projects => {
        projects = projects || [];
        this.activeProjectsCount = projects.length;
      })
    );
  }

  onOpen() {
    this.isShow = true;
  }
  onSelect(status: ProjectStatus) {
    if (this.canSelect(status)) {
      this.innerStatus = status;
    }
  }

  onConfirm() {
    if (this.canSelect(this.innerStatus)) {
      this.select.emit(this.innerStatus);
      this.isShow = false;
    }
  }
  onCancel() {
    this.innerStatus = this.outerStatus;
    this.isShow = false;
  }

  private canSelect(status: ProjectStatus): boolean {
    this.showError = status === ProjectStatus.InProgress && this.activeProjectsCount >= 4;
   return !this.showError;
  }

}
