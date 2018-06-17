import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { isFinished, now, Todo, TodoStatus } from '@app/model';
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
    return this.todo.status === TodoStatus.Someday ? 'yellow' :
      this.todo.status === TodoStatus.Waiting ? 'green' :
      this.todo.happenDate < startOfDay(now()).getTime() ? 'error' :
      this.todo.expectedTime === 0 ? 'purple' : null;
  }
  isFinished() {
    return isFinished(this.todo);
  }
}
