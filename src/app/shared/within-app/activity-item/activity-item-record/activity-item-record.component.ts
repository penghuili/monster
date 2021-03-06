import { Component, Input } from '@angular/core';
import { Event, MonsterEvents, Thought } from '@app/model';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-activity-item-record',
  templateUrl: './activity-item-record.component.html',
  styleUrls: ['./activity-item-record.component.scss']
})
export class ActivityItemRecordComponent {
  @Input() activity: Event;
  @Input() data: Thought;

  MonsterEvents = MonsterEvents;
  ROUTES = ROUTES;
}
