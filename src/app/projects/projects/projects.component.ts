import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '@app/core';
import { Project, ProjectStatus } from '@app/model';
import { ROUTES, Unsub } from '@app/static';

@Component({
  selector: 'mst-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends Unsub implements OnInit {
  activeProjects: Project[];
  doneProjects: Project[];

  dragIndex: number;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.projectService.getAll().subscribe(projects => {
        this.updateProjects(projects);
      })
    );
  }

  onShowDetail(project: Project) {
    this.router.navigate([ project.id ], { relativeTo: this.route });
  }
  onGotoCreate() {
    this.router.navigate([ ROUTES.CREATE ], { relativeTo: this.route });
  }
  onDragStart(dragIndex: number) {
    this.dragIndex = dragIndex;
  }
  onDrop(dropIndex: number) {
    if (dropIndex !== this.dragIndex) {
      const dragged = this.activeProjects[this.dragIndex];
      const dropped = this.activeProjects[dropIndex];
      this.projectService.swap(dragged, dropped);
    }
  }

  private updateProjects(projects: Project[]) {
    this.activeProjects = projects.filter(a => a.status === ProjectStatus.InProgress);
    this.doneProjects = projects.filter(a => a.status === ProjectStatus.Done).sort((a, b) => b.finishAt - a.finishAt);
  }

}
