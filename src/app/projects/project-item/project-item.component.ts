import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProjectBase, ProjectStatus } from '@app/model';

@Component({
  selector: 'mst-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectItemComponent {
  @Input() project: ProjectBase;

  ProjectStatus = ProjectStatus;
}
