import { Injectable } from '@angular/core';
import { swapItems } from '@app/model';
import { prepend } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';

import { createProject, Project } from '../../model/project';
import { MonsterStorage } from '../../model/utils';
import { INBOX } from '../../static/config';

@Injectable()
export class ProjectService {
  private projects$ = new BehaviorSubject<Project[]>([]);
  private currentProjects$ = new BehaviorSubject<Project>(null);

  constructor() {
    const projects = MonsterStorage.get('projects');
    this.projects$.next(projects);

    /**
     * @todo maybe not need this
     */
    const current = MonsterStorage.get('current-project') || INBOX;
    this.currentProjects$.next(current);
  }

  getAll(): Observable<Project[]> {
    return this.projects$.asObservable().pipe(
      filter(data => !!data),
      map(data => data.filter(a => a.id !== INBOX.id))
    );
  }
  getById(id: string): Project {
    return this.projects$.getValue().find(a => a.id === id);
  }
  getCurrent(): Observable<Project> {
    return this.currentProjects$.asObservable();
  }
  updateCurrent(project: Project) {
    MonsterStorage.set('current-project', project);
    this.currentProjects$.next(project);
  }
  updateProjects(projects: Project[]) {
    MonsterStorage.set('projects', projects);
    this.projects$.next(projects);
  }
  create(data: any): Project {
    const p = createProject(data);
    const projects = prepend(p, MonsterStorage.get('projects'));
    this.updateProjects(projects);
    return p;
  }
  swap(dragged: Project, dropped: Project) {
    const projects: Project[] = MonsterStorage.get('projects');
    const swapped = <Project[]>swapItems(dragged, dropped, projects);
    if (swapped) {
      this.updateProjects(swapped);
    }
  }
}
