import { Injectable } from '@angular/core';
import { concat, filter, find, merge, prepend } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { filter as filterO, map } from 'rxjs/operators';

import { Project } from '../../model/project';
import { createTodo, newerTodo, Todo, TodoStatus } from '../../model/todo';
import { MonsterStorage, now } from '../../model/utils';

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
  updateInProgress(todos: Todo[]) {
    MonsterStorage.set('in-progress', todos);
    this.inProgress$.next(todos);
  }
  updateDoneRecently(todos: Todo[]) {
    MonsterStorage.set('done-recently', todos);
    this.doneRecently$.next(todos);
  }
  getById(id: string): Observable<Todo> {
    return this.getInProgress().pipe(
      map(todos => todos.find(a => a.id === id))
    );
  }
  deleteById(id: string) {
    const doneReacently: Todo[] = MonsterStorage.get('done-recently');
    const target = find(x => x.id === id, doneReacently);
    if (target) {
      const updatedDone = filter(a => a.id !== id, doneReacently);
      this.updateDoneRecently(updatedDone);
    }
  }
  create(data: Todo) {
    const todo = createTodo(data);
    const inProgress = MonsterStorage.get('in-progress');
    const added = prepend(todo, inProgress);
    this.updateInProgress(added);
  }
  update(todo: Todo) {
    const inProgress: Todo[] = MonsterStorage.get('in-progress');
    const target = find(a => a.id === todo.id, inProgress);
    if (target) {
      const updatedInProgress = inProgress.map(a => a.id === todo.id ? todo : a);
      this.updateInProgress(updatedInProgress);
    }
  }
  finish(id: string) {
    const inProgress: Todo[] = MonsterStorage.get('in-progress');
    const target = find(t => t.id === id, inProgress);
    if (target) {
      const timestamp = now();
      const t: Todo = {
        finishAt: timestamp,
        status: TodoStatus.Done,
        updatedAt: timestamp
      };
      const todo = merge(target, t);

      const updatedInProgress = filter(a => a.id !== id, inProgress);

      const doneReacently = MonsterStorage.get('done-recently');
      const updatedDone = prepend(todo, doneReacently);

      this.updateInProgress(updatedInProgress);
      this.updateDoneRecently(updatedDone);
    }
  }
  undo(id: string) {
    const doneReacently: Todo[] = MonsterStorage.get('done-recently');
    const target = find(x => x.id === id, doneReacently);
    if (target) {
      const t: Todo = {
        finishAt: undefined,
        status: TodoStatus.InProgress,
        updatedAt: now()
      };
      const todo = merge(target, t);

      const inProgress: Todo[] = MonsterStorage.get('in-progress');
      const updatedInProgress = prepend(todo, inProgress);

      const updatedDone = filter(a => a.id !== id, doneReacently);

      this.updateInProgress(updatedInProgress);
      this.updateDoneRecently(updatedDone);
    }
  }
  merge(incomeArr: Todo[], sourceArr: Todo[]) {
    let merged = [];
    let newer: Todo;
    Array(incomeArr.length + sourceArr.length).fill(1).forEach(() => {
      const incomeHead = incomeArr[0];
      const sourceHead = sourceArr[0];
      if (incomeHead && sourceHead) {
        newer = newerTodo(incomeHead, sourceHead);
        merged.push(newer);
        if (newer.id === incomeHead.id) {
          incomeArr = incomeArr.slice(1);
        } else {
          sourceArr = sourceArr.slice(1);
        }
      } else if (!incomeHead && sourceHead) {
        merged = concat(merged, sourceArr);
        return;
      } else if (incomeHead && !sourceHead) {
        merged = concat(merged, incomeArr);
        return;
      } else {
        return;
      }
    });

    return merged;
  }



  process() {
    const inProgress: Todo[] = MonsterStorage.get('in-progress');
    const doneReacently: Todo[] = MonsterStorage.get('done-recently');

    const updatedInProgress = inProgress.map(t => {
      const p = (<any>t).project;
      const projectId = p ? p.id : t.projectId;
      const pid = projectId && projectId[0] === 't' ? 'p' + projectId.slice(1) : projectId;
      delete (<any>t).project;
      return merge(t, { projectId: pid });
    });
    const updatedDone = doneReacently.map(t => {
      const p = (<any>t).project;
      const projectId = p ? p.id : t.projectId;
      const pid = projectId && projectId[0] === 't' ? 'p' + projectId.slice(1) : projectId;
      delete (<any>t).project;
      return merge(t, { projectId: pid });
    });
    this.updateInProgress(updatedInProgress);
    this.updateDoneRecently(updatedDone);


    const projects: Project[] = MonsterStorage.get('projects');
    const updatedProjects = projects.map(a => a.id[0] === 't' ? merge(a, { id: 'p' + a.id.slice(1) }) : a);
    MonsterStorage.set('projects', updatedProjects);
  }
}
