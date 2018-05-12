import { Injectable } from '@angular/core';
import { EventType, MonsterEvents, now, Todo } from '@app/model';
import { find, merge } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { createProject, createSubproject, Project, Subproject } from '../../model/project';
import { DbService } from './db.service';
import { EventService } from './event.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class ProjectService {

  constructor(
    private dbService: DbService,
    private eventService: EventService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {
  }

  getProjects(): Observable<Project[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().projects.toArray()
    ).pipe(
      filter(data => !!data),
      catchError(error => this.handleError('getProjects fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getProjectsByIds(ids: number[]): Observable<Project[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().projects
        .where('id')
        .anyOf(ids)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getProjectsByIds fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getProjectById(id: number): Observable<Project> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().projects
        .where('id')
        .equals(id)
        .first()
    ).pipe(
      catchError(error => this.handleError('getProjectById fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  addProjectTitleToTodos(todos: Todo[]): Observable<Todo[]> {
    if (!todos || todos.length === 0) {
      return of([]);
    }
    this.loadingService.isLoading();
    return combineLatest(this.getProjects(), this.getSubprojects()).pipe(
      map(([projects, subprojects]) => {
        return todos
          .map(a => find(b => b.id === a.subprojectId, subprojects))
          .map(a => find(b => b.id === a.projectId, projects))
          .map((a, i) => merge(todos[i], { projectTitle: a.title }));
      })
    ).pipe(
      catchError(error => this.handleError('addProjectTitleToTodos fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getSubprojects(projectId?: number): Observable<Subproject[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().subprojects
        .filter(x => projectId ? x.projectId === projectId : true)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getSubprojects fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getSubprojectsByIds(ids: number[]): Observable<Subproject[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().subprojects
        .where('id')
        .anyOf(ids)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getSubprojectsByIds fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getSubprojectById(subid: number): Observable<Subproject> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().subprojects
         .where('id')
         .equals(subid)
        .first()
    ).pipe(
      catchError(error => this.handleError('getSubprojectById fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  addProject(data: any): Observable<any> {
    this.loadingService.isLoading();
    const p = createProject(data);
    return fromPromise(
      this.dbService.getDB().projects.add(p)
    ).pipe(
      tap(id => {
        this.eventService.add({
          createdAt: now(),
          refId: id,
          type: EventType.Project,
          action: MonsterEvents.CreateProject
        });
      })
    ).pipe(
      catchError(error => this.handleError('addProject fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  addSubproject(data: any): Observable<any> {
    this.loadingService.isLoading();
    const sp = createSubproject(data);
    return fromPromise(
      this.dbService.getDB().subprojects.add(sp)
    ).pipe(
      tap(id => {
        this.eventService.add({
          createdAt: now(),
          refId: id,
          type: EventType.Subproject,
          action: MonsterEvents.CreateSubproject
        });
      })
    ).pipe(
      catchError(error => this.handleError('addSubproject fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  updateProject(project: Project) {
    this.loadingService.isLoading();
    fromPromise(
      this.dbService.getDB().projects.put(project)
    ).pipe(
      catchError(error => this.handleError('updateProject fails'))
    ).subscribe(() => {
      this.loadingService.stopLoading();
    });
  }
  updateSubproject(subproject: Subproject) {
    this.loadingService.isLoading();
    fromPromise(
      this.dbService.getDB().subprojects.put(subproject)
    ).pipe(
      catchError(error => this.handleError('updateSubproject fails'))
    ).subscribe(() => {
      this.loadingService.stopLoading();
    });
  }
  updateSubprojects(subprojects: Subproject[]) {
    this.loadingService.isLoading();
    fromPromise(
      this.dbService.getDB().subprojects.bulkPut(subprojects)
    ).pipe(
      catchError(error => this.handleError('updateSubprojects fails'))
    ).subscribe(() => {
      this.loadingService.stopLoading();
    });
  }
  updateSubprojectStartEndDateWithTodo(todo: Todo) {
    if (todo) {
      this.loadingService.isLoading();
      fromPromise(
        this.dbService.getDB().subprojects
          .get(todo.subprojectId)
      ).subscribe(subproject => {
        let changed = false;
        if (!subproject.startDate || subproject.startDate > todo.happenDate) {
          subproject.startDate = todo.happenDate;
          changed = true;
        }
        if (!subproject.endDate || subproject.endDate < todo.happenDate) {
          subproject.endDate = todo.happenDate;
          changed = true;
        }
        this.loadingService.stopLoading();
        if (changed) {
          this.updateSubproject(subproject);
        }
      });
    }
  }
  swapProjects(dragged: Project, dropped: Project) {
    // const projects: Project[] = MonsterStorage.get('projects');
    // const swapped = <Project[]>swapItems(dragged, dropped, projects);
    // if (swapped) {
    //   this.updateProjects(swapped);
    // }
  }
  addStartEndDateToAllSubprojects() {
    this.loadingService.isLoading();
    let subprojects: Subproject[] = [];
    const db = this.dbService.getDB();
    fromPromise(
      db.subprojects.toArray()
    ).pipe(
      switchMap(sps => {
        subprojects = sps;
        return fromPromise(db.todos.toArray());
      })
    ).subscribe(todos => {
      const sorted = todos ? todos.sort((a, b) => a.happenDate - b.happenDate) : [];
      subprojects = subprojects.map(sp => {
        const todosOfThisSubproject = sorted.filter(a => a.subprojectId === a.id);
        const len = todosOfThisSubproject.length;
        const startDate = todosOfThisSubproject[0] ? todosOfThisSubproject[0].happenDate : now();
        const endDate = todosOfThisSubproject[len - 1] ? todosOfThisSubproject[len - 1].happenDate : now();
        sp.startDate = startDate;
        sp.endDate = endDate;
        return sp;
      });
      this.loadingService.stopLoading();
      this.updateSubprojects(subprojects);
    });
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
