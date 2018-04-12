import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo, TodoStatus } from '@app/model';

@Component({
  selector: 'monster-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  @Input() todo: Todo;
  @Input() isLast: boolean;
  @Output() finish = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  TodoStatus = TodoStatus;

  onDelete(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.delete.emit(id);
  }
  onFinish(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.finish.emit(id);
  }
}
