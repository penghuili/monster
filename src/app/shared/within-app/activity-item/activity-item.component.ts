import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Event, EventType } from '@app/model';

@Component({
  selector: 'mst-activity-item',
  templateUrl: './activity-item.component.html',
  styleUrls: ['./activity-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityItemComponent {
  @Input() activity: Event;
  @Input() nextActivity: Event;
  @Input() reverse = false;
  EventType = EventType;
}
