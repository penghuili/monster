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
    this.projects$.next(this.addDefault(projects));

    const current = MonsterStorage.get('current-project') || INBOX;
    this.currentProjects$.next(current);
  }

  getProjects(): Observable<Project[]> {
    return this.projects$.asObservable().pipe(
      filter(data => !!data)
    );
  }
  getCurrent(): Observable<Project> {
    return this.currentProjects$.asObservable();
  }
  setCurrent(project: Project) {
    MonsterStorage.set('current-project', project);
    this.currentProjects$.next(project);
  }
  create(data: Project) {
    const p = createProject(data);
    const projects = append(p, MonsterStorage.get('projects'));
    const projectsWithInbox = this.addDefault(projects);
    MonsterStorage.set('projects', projects);
    this.projects$.next(projectsWithInbox);
  }

  private addDefault(projects: Project[]): Project[] {
    const defaultP = [INBOX, ALL];
    return projects ? concat(defaultP, projects) : defaultP;
  }
}
