import { Injectable } from '@angular/core';
import { EventType, MonsterEvents, now, Todo } from '@app/model';
import { find, merge } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { filter, map, tap } from 'rxjs/operators';

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
    return fromPromise(
      this.dbService.getDB().projects.toArray()
    ).pipe(
      filter(data => !!data)
    );
  }
  getProjectById(id: number): Observable<Project> {
    return fromPromise(
      this.dbService.getDB().projects
        .where('id')
        .equals(id)
        .first()
    );
  }
  addProjectTitleToTodos(todos: Todo[]): Observable<Todo[]> {
    if (!todos || todos.length === 0) {
      return of([]);
    }
    return combineLatest(this.getProjects(), this.getSubprojects()).pipe(
      map(([projects, subprojects]) => {
        return todos
          .map(a => find(b => b.id === a.subprojectId, subprojects))
          .map(a => find(b => b.id === a.projectId, projects))
          .map((a, i) => merge(todos[i], { projectTitle: a.title }));
      })
    );
  }
  getSubprojects(projectId?: number): Observable<Subproject[]> {
    return fromPromise(
      this.dbService.getDB().subprojects
        .filter(x => projectId ? x.projectId === projectId : true)
        .toArray()
    );
  }
  getSubprojectById(subid: number): Observable<Subproject> {
    return fromPromise(
      this.dbService.getDB().subprojects
         .where('id')
         .equals(subid)
        .first()
    );
  }
  addProject(data: any): Observable<any> {
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
    );
  }
  addSubproject(data: any): Observable<any> {
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
    );
  }
  updateProject(project: Project) {
    this.loadingService.isLoading();
    fromPromise(
      this.dbService.getDB().projects.put(project)
    ).subscribe(() => {
      this.loadingService.stopLoading();
    });
  }
  updateSubproject(subproject: Subproject) {
    this.loadingService.isLoading();
    fromPromise(
      this.dbService.getDB().subprojects.put(subproject)
    ).subscribe(() => {
      this.loadingService.stopLoading();
    });
  }
  swapProjects(dragged: Project, dropped: Project) {
    // const projects: Project[] = MonsterStorage.get('projects');
    // const swapped = <Project[]>swapItems(dragged, dropped, projects);
    // if (swapped) {
    //   this.updateProjects(swapped);
    // }
  }

  processProjects() {
  }
  processSubprojects() {
  }
}
