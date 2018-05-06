import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Todo, TodoStatus } from '@app/model';

@Component({
  selector: 'mst-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  @Input() todo: Todo;

  TodoStatus = TodoStatus;
}
