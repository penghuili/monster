import { Injectable } from '@angular/core';
import { createTodo, MonsterStorage, now, Todo, TodoStatus } from '@app/model';
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
  getById(id: string): Observable<Todo> {
    return this.get7Days().pipe(
      map(todos => todos.find(a => a.id === id))
    );
  }
  create(data: any) {
    const todo = createTodo(data);
    const todos = MonsterStorage.get('todos');
    const added = prepend(todo, todos);
    this.updateTodos(added);
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
    const indexDragged = findIndex(a => a.id === dragged.id, todos);
    const indexDropped = findIndex(a => a.id === dropped.id, todos);
    if (indexDragged > -1 && indexDropped > -1) {
      let start: Todo;
      let end: Todo;
      let index3: number;
      if (dragged.prevId && !dragged.nextId) {
        const draggedPrevIndex = findIndex(a => a.id === dragged.prevId, todos);
        if (draggedPrevIndex > -1) {
          todos[draggedPrevIndex].nextId = undefined;
        }
      }
      if (dragged.nextId && !dragged.prevId) {
        const draggedNextIndex = findIndex(a => a.id === dragged.nextId, todos);
        if (draggedNextIndex > -1) {
          todos[draggedNextIndex].prevId = undefined;
        }
      }
      if (dragged.position > dropped.position) {
        start = dropped;
        if (dropped.nextId || this.dragged(dropped)) {
          index3 = findIndex(a => a.id === dropped.nextId, todos);
          end = todos[index3];
        } else {
          index3 = indexDropped + 1;
          end = todos[index3];
        }
      } else {
        if (dropped.prevId || this.dragged(dropped)) {
          index3 = findIndex(a => a.id === dropped.prevId, todos);
          start = todos[index3];
        } else {
          index3 = indexDropped - 1;
          start = todos[index3];
        }
        end = dropped;
      }

      const nextId = dragged.nextId;
      const prevId = dragged.prevId;
      if (!start) {
        if (end.nextId === dragged.id) {
          end.nextId = nextId;
        }
        end.prevId = dragged.id;
        dragged.prevId = undefined;
        dragged.nextId = end.id;

        dragged.position = now().toString() + '3';

        todos[indexDragged] = dragged;
        todos[indexDropped] = end;
      } else if (!end) {
        if (start.prevId === dragged.id) {
          start.prevId = prevId;
        }
        start.nextId = dragged.id;
        dragged.prevId = start.id;
        dragged.nextId = undefined;

        const position = start.position;
        const len = position.length;
        dragged.position = position.slice(0, len - 1) + (+position[len - 1] - 1);

        todos[indexDragged] = dragged;
        todos[indexDropped] = start;
      } else {
        if (start.prevId === dragged.id) {
          start.prevId = prevId;
        }
        start.nextId = dragged.id;
        if (end.nextId === dragged.id) {
          end.nextId = nextId;
        }
        end.prevId = dragged.id;
        dragged.prevId = start.id;
        dragged.nextId = end.id;

        const try1 = end.position + '3';
        if (try1 === start.position) {
          const position = start.position;
          const len = position.length;
          dragged.position = position.slice(0, len - 1) + '23';
        } else {
          dragged.position = try1;
        }

        todos[indexDragged] = dragged;
        if (start.id === dropped.id) {
          todos[indexDropped] = start;
          todos[index3] = end;
        } else {
          todos[indexDropped] = end;
          todos[index3] = start;
        }
      }

      this.updateTodos(todos);
    }
  }

  private dragged(todo: Todo): boolean {
    return !!todo.prevId || !!todo.nextId || todo.position !== todo.createdAt + '3';
  }
  private updateTodos(todos: Todo[]) {
    MonsterStorage.set('todos', todos);
    this.todos$.next(todos);
  }
}
