import { Injectable } from '@angular/core';
import { append, find, prepend } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';

import { createProject, Project, ProjectStatus } from '../../model/project';
import { MonsterStorage } from '../../model/utils';
import { INBOX } from '../../static/config';

@Injectable()
export class ProjectService {
  private projects$ = new BehaviorSubject<Project[]>([]);
  private currentProjects$ = new BehaviorSubject<Project>(null);

  constructor() {
    /**
     * @todo delete this
     */
    this.addDefaults();
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
  updateProjects(projects: Project[]) {
    MonsterStorage.set('projects', projects);
    this.projects$.next(projects);
  }
  create(data: any) {
    const p = createProject(data);
    const projects = append(p, MonsterStorage.get('projects'));
    this.updateProjects(projects);
  }

  private addDefaults() {
    const projects: Project[] = MonsterStorage.get('projects');
    const inbox: Project = {
      id: INBOX.id,
      title: 'inbox',
      startDate: 0,
      endDate: 0,
      subprojects: [],
      result: '',
      status: ProjectStatus.InProgress
    };
    const p = find(a => a.id === inbox.id, projects);
    if (!p) {
      const ps = prepend(p, projects);
      this.updateProjects(ps);
    }
  }
}
