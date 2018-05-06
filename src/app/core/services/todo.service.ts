import { Injectable } from '@angular/core';
import { createTodo, MonsterStorage, now, swapItems, Todo, TodoStatus } from '@app/model';
import { differenceInDays } from 'date-fns';
import { findIndex, merge, prepend } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class TodoService {
  private todos$ = new BehaviorSubject<Todo[]>([]);
  private inProgress$ = new BehaviorSubject<Todo[]>([]);
  private doneRecently$ = new BehaviorSubject<Todo[]>([]);

  constructor() {
    const todos = MonsterStorage.get('todos') || [];
    this.todos$.next(todos);

    const inProgress = MonsterStorage.get('in-progress');
    const doneReacently = MonsterStorage.get('done-recently');
    this.inProgress$.next(inProgress);
    this.doneRecently$.next(doneReacently);
  }

  get7Days(): Observable<Todo[]> {
    return this.todos$.asObservable().pipe(
      map(todos => todos.filter(a => differenceInDays(a.happenDate, now()) <= 7))
    );
  }
  getTodosBySubprojectId(id: string): Observable<Todo[]> {
    return this.todos$.asObservable().pipe(
      map(todos => todos.filter(a => a.subprojectId === id))
    );
  }
  getById(id: string): Observable<Todo> {
    return this.get7Days().pipe(
      map(todos => todos.find(a => a.id === id))
    );
  }
  create(data: any): Todo {
    const todo = createTodo(data);
    const todos = MonsterStorage.get('todos');
    const added = prepend(todo, todos);
    this.updateTodos(added);
    return todo;
  }
  update(todo: Todo) {
    const todos: Todo[] = MonsterStorage.get('todos');
    const index = findIndex(a => a.id === todo.id, todos);
    if (index >= 0) {
      todos[index] = todo;
      this.updateTodos(todos);
    }
  }
  finish(id: string) {
    const todos: Todo[] = MonsterStorage.get('todos');
    const index = findIndex(t => t.id === id, todos);
    if (index >= 0) {
      const timestamp = now();
      const t = {
        finishAt: timestamp,
        status: TodoStatus.Done,
        updatedAt: timestamp
      };
      const todo = merge(todos[index], t);
      todos[index] = todo;
      this.updateTodos(todos);
    }
  }
  swap(dragged: Todo, dropped: Todo) {
    const todos: Todo[] = MonsterStorage.get('todos');
    const swapped = <Todo[]>swapItems(dragged, dropped, todos);
    if (swapped) {
      this.updateTodos(swapped);
    }
  }

  updateTodos(todos: Todo[]) {
    MonsterStorage.set('todos', todos);
    this.todos$.next(todos);
  }
}
