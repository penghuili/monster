import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '@app/core';
import { now, Project, Subproject } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { addDays } from 'date-fns';
import { append, merge } from 'ramda';
import { debounceTime, first, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'mst-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent extends Unsub implements OnInit {
  project: Project;
  subprojects: Subproject[];
  titleControl = new InputControl('');
  resultControl = new InputControl('');

  hasTitleError = false;
  hasResultError = false;

  startDate: number;
  endDate: number;
  endDateStartDate: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.projectService.getProjectById(this.route.snapshot.paramMap.get('id')).pipe(
        first(),
        tap(project => {
          this.project = project;
          this.titleControl.setValue(project.title);
          this.resultControl.setValue(project.result);
          this.startDate = project.startDate;
          this.endDateStartDate = addDays(this.startDate, 1).getTime();
          this.endDate = project.endDate;
        }),
        switchMap(project => this.projectService.getSubprojects(project.id))
      ).subscribe(subprojects => {
        this.subprojects = subprojects;
      })
    );

    this.addSubscription(
      this.titleControl.value$.pipe(
        debounceTime(300)
      ).subscribe(title => {
        this.update({ title });
      })
    );

    this.addSubscription(
      this.resultControl.value$.pipe(
        debounceTime(300)
      ).subscribe(result => {
        this.update({ result });
      })
    );
  }

  onPickStartDate(date: number) {
    this.startDate = date;
    this.update({ startDate: date });
    this.endDateStartDate = addDays(this.startDate, 1).getTime();
    if (this.startDate > this.endDate) {
      this.endDate = addDays(this.startDate, 1).getTime();
    }
  }
  onPickEndDate(date: number) {
    this.endDate = date;
    this.update({ endDate: date });
  }
  onGotoSub(subid: string) {
    this.router.navigate([ subid ], { relativeTo: this.route });
  }

  private update(data: any) {
    const title = this.titleControl.getValue();
    const result = this.resultControl.getValue();

    if (title && result) {
      this.hasResultError = false;
      this.hasTitleError = false;
      this.project = merge(this.project, {
        ...data,
        updatedAt: now()
      });
      this.projectService.updateProject(this.project);
    } else {
      this.hasTitleError = !title;
      this.hasResultError = !result;
    }
  }
}
