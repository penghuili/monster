import { Component, OnInit } from '@angular/core';

import { Todo, TodoStatus, TodoHappenOn } from '../../model/todo';

@Component({
  selector: 'app-todos',
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
        createdAt: now,
        title: 'test',
        status: TodoStatus.Inprogress,
        happenOn: TodoHappenOn.Someday
      }
    ];
  }

}
