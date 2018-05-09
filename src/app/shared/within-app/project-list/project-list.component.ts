import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '@app/core';
import { Project, ProjectStatus, Subproject } from '@app/model';
import { ROUTES, Unsub } from '@app/static';
import { switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'mst-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProjectListComponent extends Unsub implements OnInit {
  @Input() activeSubproject: Subproject;
  @Input() hasError: boolean;
  @Output() selected = new EventEmitter<Subproject>();

  projects: Project[];
  subprojects: Subproject[];
  activeProject: Project;

  isShow = false;

  private clickProject = new Subject<Project>();

  constructor(
    private projectService: ProjectService,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.projectService.getProjects().subscribe(data => {
        this.projects = data.filter(a => a.status === ProjectStatus.InProgress);
      })
    );

    this.addSubscription(
      this.clickProject.asObservable().pipe(
        switchMap(project => this.projectService.getSubprojects(project.id))
      ).subscribe(subprojects => {
        this.subprojects = subprojects;
      })
    );
  }

  onOpen() {
    this.isShow = true;
  }
  onClose() {
    this.isShow = false;
  }
  onSelectProject(project: Project) {
    this.activeProject = project;
    this.clickProject.next(this.activeProject);
  }
  onSelectSubproject(subproject: Subproject) {
    this.selected.emit(subproject);
    this.isShow = false;
  }

  onGotoSubproject() {
    if (this.activeSubproject) {
      this.router.navigateByUrl(`${ROUTES.PROJECTS}/${this.activeSubproject.projectId}/${this.activeSubproject.id}`);
    }
  }
}
