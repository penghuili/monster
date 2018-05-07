import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { now, Todo, TodoStatus } from '@app/model';
import { startOfDay } from 'date-fns';

@Component({
  selector: 'mst-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  @Input() todo: Todo;

  TodoStatus = TodoStatus;

  getColor(): string {
    return this.todo.status === TodoStatus.Done || this.todo.status === TodoStatus.WontDo ? 'grey' :
      this.todo.status === TodoStatus.Waiting ? 'green' :
      this.todo.happenDate < startOfDay(now()).getTime() ? 'error' : null;
  }
}
