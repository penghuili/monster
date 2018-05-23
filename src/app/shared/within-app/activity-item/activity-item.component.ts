import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Event, EventType, MonsterEvents, Project, Subproject, Todo } from '@app/model';
import { FONT_SIZE, ROUTES } from '@app/static';

@Component({
  selector: 'mst-activity-item',
  templateUrl: './activity-item.component.html',
  styleUrls: ['./activity-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityItemComponent {
  @Input() activity: Event;
  @Input() nextActivity: Event;
  @Input() data: Project | Subproject | Todo;
  @Input() reverse = false;
  EventType = EventType;
  MonsterEvents = MonsterEvents;
  ROUTES = ROUTES;
}
