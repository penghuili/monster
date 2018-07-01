import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Project, ProjectStatus, ProjectWithSubproject, sortByPosition, Subproject } from '@app/model';
import { Unsub } from '@app/static';
import { startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { ProjectService } from '../../../core/services/project.service';
import { SubprojectService } from '../../../core/services/subproject.service';

@Component({
  selector: 'mst-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProjectListComponent extends Unsub implements OnInit {
  @Input() set activeSubproject(value: Subproject) {
    this.outerSubproject = value;
    this.innerSubproject = value;
  }
  @Input() disabled = false;
  @Input() hasError: boolean;
  @Output() selected = new EventEmitter<ProjectWithSubproject>();

  projects: Project[];
  somedayProjects: Project[];
  subprojects: Subproject[];

  isShow = false;

  activeProject: Project;
  outerSubproject: Subproject;
  innerSubproject: Subproject;
  private loadSubprojects = new Subject<Project>();
  private loadProjects = new Subject<boolean>();

  constructor(
    private projectService: ProjectService,
    private subprojectService: SubprojectService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.loadProjects.asObservable().pipe(
        startWith(true),
        switchMap(() => this.projectService.getProjects())
      ).subscribe(data => {
        this.projects = <Project[]>sortByPosition(data.filter(a => a.status === ProjectStatus.InProgress));
        this.somedayProjects = <Project[]>sortByPosition(data.filter(a => a.status === ProjectStatus.Someday));
      })
    );

    this.addSubscription(
      this.loadSubprojects.asObservable().pipe(
        switchMap(project => this.subprojectService.getSubprojects(project.id))
      ).subscribe(subprojects => {
        this.subprojects = subprojects;
      })
    );
  }

  onOpen() {
    if (!this.disabled) {
      this.isShow = true;
    }
  }
  onClose() {
    this.isShow = false;
    this.activeProject = null;
    this.innerSubproject = this.outerSubproject;
  }
  onSelectProject(project: Project) {
    this.activeProject = project;
    this.loadSubprojects.next(this.activeProject);
  }
  onSelectSubproject(subproject: Subproject) {
    this.innerSubproject = subproject;
    this.selected.emit({ project: this.activeProject, subproject });
    this.isShow = false;
  }
  onCreatedSubproject() {
    this.loadSubprojects.next(this.activeProject);
  }
  onCreatedProject() {
    this.loadProjects.next(true);
  }
}
