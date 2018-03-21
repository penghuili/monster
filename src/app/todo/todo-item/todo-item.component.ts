import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

import { Todo, TodoStatus } from '../../model/todo';

@Component({
  selector: 'monster-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  @Input() todo: Todo;
  @Output() finish = new EventEmitter<string>();
  @Output() click = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  TodoStatus = TodoStatus;
}
