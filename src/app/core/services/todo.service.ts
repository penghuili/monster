import { Injectable } from '@angular/core';
import { createTodo, MonsterStorage, now, Subproject, swapItems, Todo } from '@app/model';
import { differenceInDays } from 'date-fns';
import { find, findIndex } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, switchMap, tap } from 'rxjs/operators';

import { ProjectService } from './project.service';

@Injectable()
export class TodoService {
  private todos$ = new BehaviorSubject<Todo[]>([]);
  private inProgress$ = new BehaviorSubject<Todo[]>([]);
  private doneRecently$ = new BehaviorSubject<Todo[]>([]);

  constructor(private projectService: ProjectService) {
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
  getTodosByProjectId(id: string): Observable<Todo[]> {
    let subprojects: Subproject[];
    return this.projectService.getSubprojects(id).pipe(
      tap(a => {
        subprojects = a;
      }),
      switchMap(() => this.todos$.asObservable()),
      map(todos => todos.filter(a => !!find(b => b.id === a.subprojectId, subprojects)))
    );
  }
  getById(id: string): Observable<Todo> {
    return this.get7Days().pipe(
      map(todos => todos.find(a => a.id === id))
    );
  }
  create(data: any): Todo {
    const todos = MonsterStorage.get('todos');
    const index = todos && todos[0].index ? todos[0].index + 1 : 1;
    const todo = createTodo(data, index);
    todos.unshift(todo);
    this.updateTodos(todos);
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

  process() {
  }
}
