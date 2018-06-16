import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Event, Todo, TodoThought } from '@app/model';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-activity-item-todo-thought',
  templateUrl: './activity-item-todo-thought.component.html',
  styleUrls: ['./activity-item-todo-thought.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityItemTodoThoughtComponent {
  @Input() activity: Event;
  @Input() data: {todo: Todo, thought: TodoThought};
  ROUTES = ROUTES;
}
