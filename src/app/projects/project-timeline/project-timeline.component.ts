import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { now, ProjectTimelineItem } from '@app/model';

@Component({
  selector: 'mst-project-timeline',
  templateUrl: './project-timeline.component.html',
  styleUrls: ['./project-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectTimelineComponent implements OnChanges {
  @Input() items: ProjectTimelineItem[];

  timelineItems: ProjectTimelineItem[];

  private timelineStart: number;

  ngOnChanges() {
    if (this.items && this.items.length > 0) {
      this.timelineItems = this.items.sort((a, b) => a.start - b.start);
      this.timelineStart = this.timelineItems[0].start;
      this.timelineItems = this.timelineItems.map(a => ({
        name: a.name,
        start: Math.round((a.start - this.timelineStart) / (5 * 60 * 60 * 1000)),
        end: Math.round((a.end - this.timelineStart) / (5 * 60 * 60 * 1000)),
        finished: a.finished
      }));
    } else {
      this.timelineItems = [];
    }
    console.log(this.timelineItems)
  }
  getNowTop() {
    return this.timelineStart ? Math.round((now() - this.timelineStart) / (5 * 60 * 60 * 1000)) : 0;
  }
  getNowWidth() {
    return this.timelineItems ? this.timelineItems.length * 2 : 0;
  }
}
