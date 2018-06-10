import { Injectable } from '@angular/core';
import { Event, Habit, Project, Report, Subproject, Thought, Todo } from '@app/model';
import Dexie from 'dexie';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';

class MonsterDB extends Dexie {
  todos: Dexie.Table<Todo, number>;
  projects: Dexie.Table<Project, number>;
  subprojects: Dexie.Table<Subproject, number>;
  habits: Dexie.Table<Habit, number>;
  events: Dexie.Table<Event, number>;
  reports: Dexie.Table<Report, number>;
  records: Dexie.Table<Thought, number>;

  constructor() {
    super('monster');
    this.version(1).stores({
      todos: '++id,subprojectId,createdAt,updatedAt,happenDate,expectedTime,status,finishAt,position',
      projects: '++id,createdAt,updatedAt,status,finishAt,position,startDate,endDate',
      subprojects: '++id,projectId,createdAt,updatedAt,status,finishAt,position,startDate,endDate',
      events: '++id,refId,createdAt,type,action'
    });
    this.version(2).stores({
      reports: `++id,createdAt,planned,inProgress,waiting,wontDo,done,finishTooLate,
      finishTooEarly,beforeToday,beforeTodayNotFinished,withoutTime,plannedTime,
      usedTime,finishedUsedTime,finishedPlannedTime`
    });
    this.version(3).stores({
      reports: '++id,createdAt'
    });
    this.version(4).stores({
      records: '++id,createdAt'
    });
    this.version(5).stores({
      reports: '++id,date'
    });
    this.version(6).stores({
      reports: '++id,date,type'
    });
    this.version(7).stores({
      habits: '++id'
    });
  }
}
@Injectable()
export class DbService {
  private db: MonsterDB;
  constructor() {
    this.db = new MonsterDB();
    this.db.open().catch(function (e) {
      alert('open db error');
    });
  }

  getDB(): MonsterDB {
    return this.db;
  }
  addTodos(todos: Todo[]): Observable<boolean> {
    return fromPromise(this.db.todos.bulkAdd(todos)).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  addProjects(projects: Project[]): Observable<boolean> {
    return fromPromise(this.db.projects.bulkAdd(projects)).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  addSubprojects(subprojects: Subproject[]): Observable<boolean> {
    return fromPromise(this.db.subprojects.bulkAdd(subprojects)).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  addEvents(events: Event[]): Observable<boolean> {
    return fromPromise(this.db.events.bulkAdd(events)).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

}
