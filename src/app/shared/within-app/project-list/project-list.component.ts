import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService, SubprojectService } from '@app/core';
import { Project, ProjectStatus, ProjectWithSubproject, Subproject } from '@app/model';
import { ROUTES, Unsub } from '@app/static';
import { switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

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
  private clickProject = new Subject<Project>();

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private subprojectService: SubprojectService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.projectService.getProjects().subscribe(data => {
        this.projects = data.filter(a => a.status === ProjectStatus.InProgress);
        this.somedayProjects = data.filter(a => a.status === ProjectStatus.Someday);
      })
    );

    this.addSubscription(
      this.clickProject.asObservable().pipe(
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
    this.clickProject.next(this.activeProject);
  }
  onSelectSubproject(subproject: Subproject) {
    this.innerSubproject = subproject;
    this.selected.emit({ project: this.activeProject, subproject });
    this.isShow = false;
  }
}
