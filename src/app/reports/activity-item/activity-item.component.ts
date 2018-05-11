import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Event, EventType, MonsterEvents, Project, Subproject, Todo } from '@app/model';
import { FONT_SIZE, ROUTES } from '@app/static';

@Component({
  selector: 'mst-activity-item',
  templateUrl: './activity-item.component.html',
  styleUrls: ['./activity-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityItemComponent implements OnChanges {
  @Input() activity: Event;
  @Input() nextActivity: Event;
  @Input() data: Project | Subproject | Todo;
  paddingBottom: number;
  EventType = EventType;
  MonsterEvents = MonsterEvents;
  ROUTES = ROUTES;

  ngOnChanges() {
    if (!this.nextActivity) {
      this.paddingBottom = 0;
    } else if (this.activity) {
      this.paddingBottom = Math.round((this.nextActivity.createdAt - this.activity.createdAt) / (1000 * 60)) + FONT_SIZE;
    }
  }

}
