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

  nowTop: number;
  nowWidth: number;
  showNowDots: boolean;

  ngOnChanges() {
    if (this.items && this.items.length > 0) {
      this.timelineItems = this.items.sort((a, b) => a.start - b.start);
      const timelineStart = this.timelineItems[0].start;
      this.timelineItems = this.timelineItems.map(a => ({
        name: a.name,
        start: Math.round((a.start - timelineStart) / (5 * 60 * 60 * 1000)),
        end: Math.round((a.end - timelineStart) / (5 * 60 * 60 * 1000)),
        finished: a.finished
      }));

      const maxHeight = Math.max(...this.timelineItems.map(a => a.end - a.start));
      const top = timelineStart ? Math.round((now() - timelineStart) / (5 * 60 * 60 * 1000)) : 0;
      if (top > maxHeight * 1.2) {
        this.showNowDots = true;
        this.nowTop = maxHeight * 1.2;
      } else {
        this.showNowDots = false;
        this.nowTop = top;
      }
      this.nowWidth = this.timelineItems.length * 2;
    } else {
      this.timelineItems = [];
      this.nowTop = 0;
      this.nowWidth = 0;
    }
  }

}
