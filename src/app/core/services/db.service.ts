import { Injectable } from '@angular/core';
import {
  Book,
  BookItem,
  Event,
  Habit,
  HabitItem,
  Project,
  Report,
  Subproject,
  Thought,
  Todo,
  TodoThought,
} from '@app/model';
import Dexie from 'dexie';

import { StorageApiService } from './storage-api.service';

class MonsterDB extends Dexie {
  todos: Dexie.Table<Todo, number>;
  todoThoughts: Dexie.Table<TodoThought, number>;
  projects: Dexie.Table<Project, number>;
  subprojects: Dexie.Table<Subproject, number>;
  habits: Dexie.Table<Habit, number>;
  habitItems: Dexie.Table<HabitItem, number>;
  events: Dexie.Table<Event, number>;
  reports: Dexie.Table<Report, number>;
  records: Dexie.Table<Thought, number>;
  books: Dexie.Table<Book, number>;
  bookItems: Dexie.Table<BookItem, number>;

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
    this.version(8).stores({
      books: '++id,startDate,endDate'
    });
    this.version(9).stores({
      bookItems: '++id,bookId,happenDate'
    });
    this.version(10).stores({
      habitItems: '++id,habitId,happenDate,status'
    });
    this.version(11).stores({
      todoThoughts: '++id,todoId,createdAt'
    });
  }
}
@Injectable()
export class DbService {
  private db: MonsterDB;
  constructor(private storageApiService: StorageApiService) {
    if (this.storageApiService.isDBSupported() && !this.storageApiService.isPrivateMode()) {
      this.db = new MonsterDB();
      this.db.open().catch(function (e) {
        alert('open db error');
      });
    }
  }

  getDB(): MonsterDB {
    return this.db;
  }

  process() {
  }
}
