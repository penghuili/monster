import { Injectable } from '@angular/core';
import { filter, find, merge, prepend } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { filter as filterO, map } from 'rxjs/operators';

import { Project } from '../../model/project';
import { createTodo, filterTodo, Todo, TodoStatus } from '../../model/todo';
import { MonsterStorage } from '../../model/utils';
import { INBOX } from '../../static/config';

/**
 * in-progress
 * done-recently
 * done-2018-03, ...
 */

@Injectable()
export class TodoService {
  private inProgress$ = new BehaviorSubject<Todo[]>([]);
  private doneRecently$ = new BehaviorSubject<Todo[]>([]);

  constructor() {
    const inProgress = MonsterStorage.get('in-progress');
    const doneReacently = MonsterStorage.get('done-recently');
    this.inProgress$.next(inProgress);
    this.doneRecently$.next(doneReacently);
  }

  getInProgress(): Observable<Todo[]> {
    return this.inProgress$.asObservable().pipe(
      filterO(data => !!data)
    );
  }
  getDoneRecently(): Observable<Todo[]> {
    return this.doneRecently$.asObservable().pipe(
      filterO(data => !!data)
    );
  }
  create(data: Todo) {
    const todo = createTodo(data);
    const inProgress = MonsterStorage.get('in-progress');
    const added = prepend(todo, inProgress);
    MonsterStorage.set('in-progress', added);
    this.inProgress$.next(added);
  }
  update(todo: Todo) {
    const inProgress: Todo[] = MonsterStorage.get('in-progress');
    const target = find(a => a.id === todo.id, inProgress);
    if (target) {
      const updatedInProgress = inProgress.map(a => a.id === todo.id ? todo : a);
      MonsterStorage.set('in-progress', updatedInProgress);
      this.inProgress$.next(updatedInProgress);
    }
  }
  finishTodo(id: string) {
    const inProgress: Todo[] = MonsterStorage.get('in-progress');
    const target = find(t => t.id === id, inProgress);
    if (target) {
      const now = new Date().getTime();
      const t: Todo = {
        finishAt: now,
        status: TodoStatus.Done,
        updatedAt: now
      };
      const todo = merge(target, t);

      const updatedInProgress = filter(a => a.id !== id, inProgress);
      MonsterStorage.set('in-progress', updatedInProgress);

      const doneReacently = MonsterStorage.get('done-recently');
      const updatedDone = prepend(todo, doneReacently);
      MonsterStorage.set('done-recently', updatedDone);

      this.inProgress$.next(updatedInProgress);
      this.doneRecently$.next(updatedDone);
    }
  }
  undoTodo(id: string) {
    const doneReacently: Todo[] = MonsterStorage.get('done-recently');
    const target = find(x => x.id === id, doneReacently);
    if (target) {
      const t: Todo = {
        finishAt: undefined,
        status: TodoStatus.InProgress,
        updatedAt: new Date().getTime()
      };
      const todo = merge(target, t);

      const inProgress: Todo[] = MonsterStorage.get('in-progress');
      const updatedInProgress = prepend(todo, inProgress);
      MonsterStorage.set('in-progress', updatedInProgress);

      const updatedDone = filter(a => a.id !== id, doneReacently);
      MonsterStorage.set('done-recently', updatedDone);

      this.inProgress$.next(updatedInProgress);
      this.doneRecently$.next(updatedDone);
    }
  }



  process() {
    const inProgress: Todo[] = MonsterStorage.get('in-progress');
    const doneReacently: Todo[] = MonsterStorage.get('done-recently');

    const updatedInProgress = inProgress.map(t => {
      delete (<any>t).projectId;
      return merge(t, { project: INBOX });
    });
    const updatedDone = doneReacently.filter(t => {
      delete (<any>t).projectId;
      return merge(t, { project: INBOX });
    });
    MonsterStorage.set('in-progress', updatedInProgress);
    MonsterStorage.set('done-recently', updatedDone);
  }
  addCreatedAt() {
    const inProgress: Todo[] = MonsterStorage.get('in-progress');
    const doneReacently: Todo[] = MonsterStorage.get('done-recently');
    const updatedInProgress = inProgress.map(t => {
      return merge(t, { createdAt: +t.id.slice(1) });
    });
    const updatedDone = doneReacently.map(t => {
      return merge(t, { createdAt: +t.id.slice(1) });
    });
    MonsterStorage.set('in-progress', updatedInProgress);
    MonsterStorage.set('done-recently', updatedDone);
  }
}
