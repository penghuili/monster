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

  MAX_PADDING_BOTTOM = 200;

  paddingBottom: number;
  overMax: boolean;

  ngOnChanges() {
    if (!this.timeNext) {
      this.paddingBottom = 0;
      this.overMax = false;
    } else if (this.time) {
      const padding = Math.round((this.timeNext - this.time) / (1000 * 60)) + FONT_SIZE;
      if (padding >= this.MAX_PADDING_BOTTOM) {
        this.overMax = true;
        this.paddingBottom = this.MAX_PADDING_BOTTOM / 2;
      } else {
        this.overMax = false;
        this.paddingBottom = padding;
      }
    }
  }
}
