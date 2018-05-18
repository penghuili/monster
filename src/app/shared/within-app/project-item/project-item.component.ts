import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { now, Project, ProjectStatus } from '@app/model';
import { startOfDay } from 'date-fns';

@Component({
  selector: 'mst-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectItemComponent {
  @Input() project: Project;

  ProjectStatus = ProjectStatus;

  getColor(): string {
    return this.project.status === ProjectStatus.Done ? 'grey' :
      this.project.status === ProjectStatus.Someday ? 'yellow' :
      this.project.endDate < startOfDay(now()).getTime() ? 'error' : null;
  }
}
