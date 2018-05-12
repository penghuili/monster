import { Injectable } from '@angular/core';
import { calcUsedTimeFor, createTodo, Event, EventType, MonsterEvents, now, Todo } from '@app/model';
import { addDays, endOfDay } from 'date-fns';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { EventService } from './event.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';
import { ProjectService } from './project.service';

@Injectable()
export class TodoService {

  constructor(
    private eventService: EventService,
    private dbService: DbService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private projectService: ProjectService) {
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
        });
      }),
      catchError(error => this.handleError('create fails')),
      tap(success => {
        this.loadingService.stopLoading();
        if (success) {
          this.projectService.updateSubprojectStartEndDateWithTodo(todo);
        }
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
  updateTodos(todos: Todo[]) {
    this.loadingService.isLoading();
    fromPromise(
      this.dbService.getDB().todos.bulkPut(todos)
    ).pipe(
      catchError(error => this.handleError('update todos fails'))
    ).subscribe(() => {
      this.loadingService.stopLoading();
    });
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
  addUsedTimeToAllTodos() {
    const db = this.dbService.getDB();
    const transaction = db.transaction('rw', db.todos, db.events, () => {
      let events: Event[];
      return db.events
        .where('type')
        .equals(EventType.Todo)
        .toArray()
        .then(es => {
          events = es;
          return db.todos.toArray();
        })
        .then(todos => {
          return [events, todos];
        });
    });
    fromPromise(transaction).subscribe(([events, todos]) => {
      const startSopEvents = (<Event[]>events).filter(a => a.action === MonsterEvents.StartTodo || a.action === MonsterEvents.StopTodo);
      if (startSopEvents.length % 2 === 0) {
        const startEvents = startSopEvents.filter((a, i) => i % 2 === 0);
        const stopEvents = startSopEvents.filter((a, i) => i % 2 === 1);
        const todosWithUsedTime = (<Todo[]>todos).map(a => {
          a.usedTime = calcUsedTimeFor(a.id, startEvents, stopEvents);
          return a;
        });
        db.todos.bulkPut(todosWithUsedTime)
        .then(() => {
          this.notificationService.sendMessage('add used time success');
        })
        .catch(error => {
          alert(error);
        });
      } else {
        this.notificationService.sendMessage('events should be even');
      }
    });
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
