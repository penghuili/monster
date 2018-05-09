import { Injectable } from '@angular/core';
import { swapItems, Todo } from '@app/model';
import { find, findIndex, merge } from 'ramda';
import { BehaviorSubject ,  Observable ,  combineLatest ,  of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { createProject, createSubproject, Project, Subproject } from '../../model/project';
import { MonsterStorage } from '../../model/utils';

@Injectable()
export class ProjectService {
  private projects$ = new BehaviorSubject<Project[]>([]);
  private subprojects$ = new BehaviorSubject<Subproject[]>([]);

  constructor() {
    const projects = MonsterStorage.get('projects');
    this.projects$.next(projects);
    const subprojects = MonsterStorage.get('sub-projects');
    this.subprojects$.next(subprojects);
  }

  getProjects(): Observable<Project[]> {
    return this.projects$.asObservable().pipe(
      filter(data => !!data)
    );
  }
  getProjectById(id: string): Observable<Project> {
    return this.getProjects().pipe(
      map(projects => find(a => a.id === id, projects))
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
  getSubprojects(projectId?: string): Observable<Subproject[]> {
    return this.subprojects$.asObservable().pipe(
      filter(data => !!data),
      map(subprojects => {
        if (projectId) {
          return subprojects.filter(a => a.projectId === projectId);
        } else {
          return subprojects;
        }
      })
    );
  }
  getSubprojectById(subid: string, id?: string): Observable<Subproject> {
    return this.getSubprojects(id).pipe(
      map(subprojects => find(a => a.id === subid, subprojects))
    );
  }
  updateProjects(projects: Project[]) {
    MonsterStorage.set('projects', projects);
    this.projects$.next(projects);
  }
  updateSubprojects(subprojects: Subproject[]) {
    MonsterStorage.set('sub-projects', subprojects);
    this.subprojects$.next(subprojects);
  }
  createProject(data: any): Project {
    const p = createProject(data);
    const projects = MonsterStorage.get('projects');
    projects.unshift(p);
    this.updateProjects(projects);
    return p;
  }
  createSubproject(data: any): Subproject {
    const sp = createSubproject(data);
    const sps: Subproject[] = MonsterStorage.get('sub-projects');
    sps.unshift(sp);
    this.updateSubprojects(sps);
    return sp;
  }
  updateProject(project: Project) {
    const projects: Project[] = MonsterStorage.get('projects');
    const index = findIndex(a => a.id === project.id, projects);
    if (index >= 0) {
      projects[index] = project;
      this.updateProjects(projects);
    }
  }
  updateSubproject(subproject: Subproject) {
    const subprojects: Subproject[] = MonsterStorage.get('sub-projects');
    const index = findIndex(a => a.id === subproject.id, subprojects);
    if (index >= 0) {
      subprojects[index] = subproject;
      this.updateSubprojects(subprojects);
    }
  }
  swapProjects(dragged: Project, dropped: Project) {
    const projects: Project[] = MonsterStorage.get('projects');
    const swapped = <Project[]>swapItems(dragged, dropped, projects);
    if (swapped) {
      this.updateProjects(swapped);
    }
  }

  processProjects() {
  }
  processSubprojects() {
  }
}
