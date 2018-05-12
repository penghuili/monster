import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FONT_SIZE } from '@app/static';

@Component({
  selector: 'mst-timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrls: ['./timeline-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineItemComponent implements OnChanges {
  @Input() time: number;
  @Input() timeNext: number;

  paddingBottom: number;

  ngOnChanges() {
    if (!this.timeNext) {
      this.paddingBottom = 0;
    } else if (this.time) {
      this.paddingBottom = Math.round((this.timeNext - this.time) / (1000 * 60)) + FONT_SIZE;
    }
  }
}
