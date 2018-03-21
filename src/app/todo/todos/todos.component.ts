import { Component, OnInit } from '@angular/core';

import { Todo, TodoStatus, TodoHappenOn } from '../../model/todo';

@Component({
  selector: 'monster-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {
  todos: Todo[];

  constructor() { }

  ngOnInit() {
    const now = new Date().getTime();
    this.todos = [
      {
        id: 'todo' + now,
        createdAt: now,
        title: 'test',
        status: TodoStatus.InProgress,
        happenOn: TodoHappenOn.Someday
      },
      {
        id: 'todo' + now,
        createdAt: now,
        title: 'test2',
        status: TodoStatus.InProgress,
        happenOn: TodoHappenOn.Someday
      }
    ];
  }

}
