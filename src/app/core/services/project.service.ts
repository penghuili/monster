import { Injectable } from '@angular/core';
import { append, concat } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';

import { createProject, Project } from '../../model/project';
import { MonsterStorage } from '../../model/utils';
import { ALL, INBOX } from '../../static/config';

@Injectable()
export class ProjectService {
  private projects$ = new BehaviorSubject<Project[]>([]);
  private currentProjects$ = new BehaviorSubject<Project>(null);

  constructor() {
    const projects = MonsterStorage.get('projects');
    this.projects$.next(this.addDefaults(projects));

    const current = MonsterStorage.get('current-project') || INBOX;
    this.currentProjects$.next(current);
  }

  getAll(): Observable<Project[]> {
    return this.projects$.asObservable().pipe(
      filter(data => !!data)
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
  updateProjects(projectsWithoutDefaults: Project[]) {
    const projectsWithInbox = this.addDefaults(projectsWithoutDefaults);
    MonsterStorage.set('projects', projectsWithoutDefaults);
    this.projects$.next(projectsWithInbox);
  }
  create(data: Project) {
    const p = createProject(data);
    const projects = append(p, MonsterStorage.get('projects'));
    this.updateProjects(projects);
  }

  private addDefaults(projects: Project[]): Project[] {
    const defaultP = [INBOX, ALL];
    return projects ? concat(defaultP, projects) : defaultP;
  }
}
