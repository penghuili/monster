import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { isBeforeToday, Project, ProjectStatus, Subproject } from '@app/model';

@Component({
  selector: 'mst-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectItemComponent {
  @Input() project: Project | Subproject;

  ProjectStatus = ProjectStatus;

  getColor(): string {
    return this.project.status === ProjectStatus.Done ? null :
      this.project.status === ProjectStatus.Someday ? 'yellow' :
      !(<Subproject>this.project).projectId && isBeforeToday((<Project>this.project).endDate) ? 'error' : null;
  }
}
