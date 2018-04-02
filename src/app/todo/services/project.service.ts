import { Injectable } from '@angular/core';
import { append, prepend } from 'ramda';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';

import { createProject, Project } from '../../model/project';
import { MonsterStorage } from '../../model/utils';
import { ALL, INBOX } from '../../static/config';

@Injectable()
export class ProjectService {
  private projects$ = new BehaviorSubject<Project[]>([]);

  constructor() {
    const projects = MonsterStorage.get('projects');
    this.projects$.next(this.addDefault(projects));
  }

  getProjects(projectId?: string): Observable<Project[]> {
    return this.projects$.asObservable().pipe(
      filter(data => !!data)
    );
  }
  getCurrent(): Project {
    return MonsterStorage.get('current-project') || INBOX;
  }
  setCurrent(project: Project) {
    MonsterStorage.set('current-project', project);
  }
  create(data: Project) {
    const p = createProject(data);
    const projects = append(p, MonsterStorage.get('projects'));
    const projectsWithInbox = this.addDefault(projects);
    MonsterStorage.set('projects', projects);
    this.projects$.next(projectsWithInbox);
  }

  private addDefault(projects: Project[]): Project[] {
    return prepend(INBOX, prepend(ALL, projects));
  }
}
