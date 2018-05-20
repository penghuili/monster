import { Injectable } from '@angular/core';
import {
  createTodo,
  endOfWeek,
  Event,
  EventType,
  isFinished,
  isWithin,
  MonsterEvents,
  now,
  repositionItems,
  startOfWeek,
  Todo,
  TodoStatus,
} from '@app/model';
import { addDays } from 'date-fns';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { EventService } from './event.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class TodoService {

  constructor(
    private eventService: EventService,
    private dbService: DbService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {
  }

  get2Weeks(): Observable<Todo[]> {
    this.loadingService.isLoading();
    const start = startOfWeek(now());
    const end = endOfWeek(addDays(now(), 7).getTime());

    return fromPromise(this.dbService.getDB()
      .todos
      .filter(a => isWithin(a.happenDate, start, end) ||
        (a.happenDate < start && (!isFinished(a) || isWithin(a.finishAt, start, end)))
      )
      .toArray()
    ).pipe(
      catchError(error => this.handleError('get2Weeks fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getTodosBySubprojectId(id: number): Observable<Todo[]> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB()
      .todos
      .where('subprojectId')
      .equals(id)
      .toArray()
    ).pipe(
      catchError(error =>  this.handleError('getTodosBySubprojectId fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getTodosByProjectId(id: number): Observable<Todo[]> {
    this.loadingService.isLoading();
    const db = this.dbService.getDB();
    const transaction = db.transaction('r', db.subprojects, db.todos, () => {
      return db.subprojects
        .where('projectId')
        .equals(id)
        .toArray()
        .then(subps => {
          return db.todos
            .filter(a => a.status !== TodoStatus.Someday && !!subps.find(b => b.id === a.subprojectId))
            .toArray();
        });
    });
    return fromPromise(transaction).pipe(
      catchError(error => this.handleError('getTodosByProjectId fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getTodosByIds(ids: number[]): Observable<Todo[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().todos
        .where('id')
        .anyOf(ids)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getTodosByIds fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getById(id: number): Observable<Todo> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB()
      .todos
      .where('id')
      .equals(id)
      .first()
    ).pipe(
      catchError(error => this.handleError('getById fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      }),
      filter(a => !!a)
    );
  }
  add(data: any): Observable<any> {
    this.loadingService.isLoading();
    const todo = createTodo(data);
    return fromPromise(this.dbService.getDB()
      .todos
      .add(todo)
    ).pipe(
      tap(id => {
        this.eventService.add({
          createdAt: now(),
          type: EventType.Todo,
          refId: id,
          action: MonsterEvents.CreateTodo
        }).subscribe();
      }),
      catchError(error => this.handleError('create fails')),
      tap(success => {
        this.loadingService.stopLoading();
      })
    );
  }
  update(todo: Todo): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().todos.put(todo)).pipe(
      map(() => true),
      catchError(error => this.handleError('update todo fails')),
      tap(success => {
        this.loadingService.stopLoading();
      })
    );
  }
  updateTodos(todos: Todo[]): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().todos.bulkPut(todos)
    ).pipe(
      catchError(error => this.handleError('update todos fails')),
      tap(success => {
        this.loadingService.stopLoading();
      })
    );
  }
  repositionTodos(dragged: Todo, dropped: Todo): Observable<any> {
    const ids: number[] = [
      dragged.id + 1,
      dragged.id - 1,
      dropped.id + 1,
      dropped.id - 1
    ];
    if (dropped.prevId) {
      ids.push(dropped.prevId);
    }
    if (dropped.nextId) {
      ids.push(dropped.nextId);
    }
    return this.getTodosByIds(ids).pipe(
      switchMap(tds => {
        if (tds) {
          tds.unshift(dropped);
          tds.unshift(dragged);
          const repositioned = <Todo[]>repositionItems(tds);
          return this.updateTodos(repositioned);
        } else {
          return of(null);
        }
      })
    );
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
