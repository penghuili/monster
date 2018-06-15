import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '@app/core';
import { Project, ProjectStatus, ProjectTimelineItem, sortByPosition } from '@app/model';
import { Unsub } from '@app/static';
import { startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends Unsub implements OnInit {
  activeProjects: Project[];
  somedayProjects: Project[];
  doneProjects: Project[];

  timelineItems: ProjectTimelineItem[];

  dragIndex: number;

  private shouldLoad = new Subject<boolean>();

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.shouldLoad.asObservable().pipe(
        startWith(true),
        switchMap(() => this.projectService.getProjects())
      ).subscribe(projects => {
        this.updateProjects(<Project[]>sortByPosition(projects));
      })
    );
  }

  onShowDetail(project: Project) {
    this.router.navigate([ project.id ], { relativeTo: this.route });
  }
  onDragStart(dragIndex: number) {
    this.dragIndex = dragIndex;
  }
  onDrop(dropIndex: number) {
    if (dropIndex !== this.dragIndex) {
      const dragged = this.activeProjects[this.dragIndex];
      const dropped = this.activeProjects[dropIndex];
      this.addSubscription(
        this.projectService.repositionProjects(dragged, dropped).subscribe(success => {
          if (success) {
            this.shouldLoad.next(true);
          }
        })
      );
    }
  }
  onCreated() {
    this.shouldLoad.next(true);
  }

  private updateProjects(projects: Project[]) {
    this.activeProjects = projects.filter(a => a.status === ProjectStatus.InProgress);
    this.somedayProjects = projects.filter(a => a.status === ProjectStatus.Someday);
    this.doneProjects = projects.filter(a => a.status === ProjectStatus.Done).sort((a, b) => b.finishAt - a.finishAt);

    this.timelineItems = this.activeProjects.map(a => ({
      name: a.title,
      start: a.startDate,
      end: a.endDate,
      finished: a.status === ProjectStatus.Done
    }));
  }

}
