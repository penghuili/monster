import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { isBeforeToday, Project, ProjectStatus } from '@app/model';

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
      this.project.endDate && isBeforeToday(this.project.endDate) ? 'error' : null;
  }
}
