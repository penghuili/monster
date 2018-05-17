import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Event, MonsterEvents, Todo } from '@app/model';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-activity-item-todo',
  templateUrl: './activity-item-todo.component.html',
  styleUrls: ['./activity-item-todo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityItemTodoComponent {
  @Input() activity: Event;
  @Input() data: Todo;

  MonsterEvents = MonsterEvents;
  ROUTES = ROUTES;
}
