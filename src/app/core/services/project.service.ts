import { Injectable } from '@angular/core';
import { EventType, MonsterEvents, now, repositionItems, sortByPosition, Todo } from '@app/model';
import { uniq } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';

import { createProject, Project, ProjectWithTodos, Subproject } from '../../model/project';
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
  getProjectsWithTodos(todos: Todo[]): Observable<ProjectWithTodos[]> {
    if (!todos || todos.length === 0) {
      return of([]);
    }
    this.loadingService.isLoading();
    let subprojects: Subproject[] = [];
    const db = this.dbService.getDB();
    const transaction = db.transaction('r', db.projects, db.subprojects, () => {
      const subprojectIds = uniq(todos.map(a => a.subprojectId));
      return db.subprojects.where('id').anyOf(subprojectIds).toArray()
        .then(sps => {
          subprojects = sps;
          const projectIds = uniq(subprojects.map(a => a.projectId));
          return db.projects.where('id').anyOf(projectIds).toArray();
        })
        .then(projects => {
          projects = <Project[]>sortByPosition(projects);
          return projects.map(p => {
            const sps = subprojects.filter(a => a.projectId === p.id);
            const tds = todos.filter(a => !!sps.find(b => b.id === a.subprojectId));
            return { project: p, todos: tds };
          });
        });
    });
    return fromPromise(transaction).pipe(
      catchError(error => this.handleError('getProjectsWithTodos fails')),
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
  updateProjects(projects: Project[]): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().projects.bulkPut(projects)
    ).pipe(
      catchError(error => this.handleError('updateProjects fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  repositionProjects(dragged: Project, dropped: Project): Observable<any> {
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
    return this.getProjectsByIds(ids).pipe(
      switchMap(ps => {
        if (ps) {
          ps.unshift(dropped);
          ps.unshift(dragged);
          const repositioned = <Project[]>repositionItems(ps);
          return this.updateProjects(repositioned);
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
