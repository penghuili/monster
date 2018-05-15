import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProjectTimelineItem } from '@app/model';

@Component({
  selector: 'mst-project-timeline-item',
  templateUrl: './project-timeline-item.component.html',
  styleUrls: ['./project-timeline-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTimelineItemComponent {
  @Input() item: ProjectTimelineItem;
}
