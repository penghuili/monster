import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Event, Following, FollowingItem, MonsterEvents } from '@app/model';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-activity-item-following-item',
  templateUrl: './activity-item-following-item.component.html',
  styleUrls: ['./activity-item-following-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityItemFollowingItemComponent {
  @Input() activity: Event;
  @Input() data: {following: Following, followingItem: FollowingItem};

  MonsterEvents = MonsterEvents;
  ROUTES = ROUTES;
}
