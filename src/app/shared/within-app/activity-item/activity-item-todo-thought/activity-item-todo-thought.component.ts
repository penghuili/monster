import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Event, TodoThought } from '@app/model';

@Component({
  selector: 'mst-activity-item-todo-thought',
  templateUrl: './activity-item-todo-thought.component.html',
  styleUrls: ['./activity-item-todo-thought.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityItemTodoThoughtComponent {
  @Input() activity: Event;
  @Input() data: TodoThought;
}
