import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { now, ProjectTimelineItem } from '@app/model';

@Component({
  selector: 'mst-project-timeline',
  templateUrl: './project-timeline.component.html',
  styleUrls: ['./project-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTimelineComponent {
  @Input() items: ProjectTimelineItem[];
  @Input() start: number;

  getNowTop() {
    return this.start ? Math.round((now() - this.start) / (1000 * 60 * 60)) : 0;
  }
  getNowWidth() {
    return this.items ? this.items.length * 2 : 0;
  }
}
