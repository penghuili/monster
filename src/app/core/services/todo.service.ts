import { Injectable } from '@angular/core';
import { createTodo, EventType, MonsterEvents, now, Todo } from '@app/model';
import { addDays, endOfDay } from 'date-fns';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

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

  get7Days(): Observable<Todo[]> {
    this.loadingService.isLoading();
    const endOfThisWeek = endOfDay(addDays(now(), 7)).getTime();

    return fromPromise(this.dbService.getDB()
      .todos
      .where('happenDate')
      .below(endOfThisWeek)
      .toArray()
    ).pipe(
      catchError(error => this.handleError('get7Days fails')),
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
          return db.todos.where('subprojectId')
            .anyOf(subps.map(a => a.id))
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
      })
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
        });
      }),
      catchError(error => this.handleError('create fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  update(todo: Todo): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().todos.put(todo)).pipe(
      map(() => true),
      catchError(error => this.handleError('update todo fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  swap(dragged: Todo, dropped: Todo) {
    // const todayEnd = endOfToday();
    // const swapped = <Todo[]>swapItems(dragged, dropped, todos);
    // if (swapped) {
    //   return this.dbService.getDB().todos
    //     .where('happenDate')
    //     .below(todayEnd)
    //     .and(x => x.status === TodoStatus.InProgress || x.status === TodoStatus.Waiting)
    // }
  }

  process() {
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
