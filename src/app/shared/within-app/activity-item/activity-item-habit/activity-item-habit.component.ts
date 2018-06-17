import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Event, Habit, MonsterEvents } from '@app/model';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-activity-item-habit',
  templateUrl: './activity-item-habit.component.html',
  styleUrls: ['./activity-item-habit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityItemHabitComponent {
  @Input() activity: Event;
  @Input() data: Habit;

  MonsterEvents = MonsterEvents;
  ROUTES = ROUTES;
}
