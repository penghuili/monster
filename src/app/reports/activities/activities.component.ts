import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from '@app/core';
import { Event, EventType, now, Project, Subproject, Todo } from '@app/model';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent extends Unsub {
  @Input() set date(value: number) {
    this._date = value || now();
    this.getActivities(this._date);
  }
  get date() {
    return this._date;
  }
  activities: Event[] = [];
  projects: Project[] = [];
  subprojects: Subproject[] = [];
  todos: Todo[] = [];
  data: (Project | Subproject | Todo)[];
  isLoading: boolean;

  private _date = now();

  constructor(private reportService: ReportService) {
    super();
  }

  private getActivities(date: number) {
    this.isLoading = true;
    this.activities = [];
    this.projects = [];
    this.subprojects = [];
    this.todos = [];
    this.data = [];
    this.addSubscription(
      this.reportService.getActivities(date).subscribe(value => {
        this.isLoading = false;
        if (value) {
          this.activities = value.activities;
          this.projects = value.projects;
          this.subprojects = value.subprojects;
          this.todos = value.todos;
          this.data = this.activities.map(a => {
            if (a.type === EventType.Project) {
              return this.projects.find(b => b.id === a.refId);
            } else if (a.type === EventType.Subproject) {
              return this.subprojects.find(b => b.id === a.refId);
            } else {
              return this.todos.find(b => b.id === a.refId);
            }
          });
        }
      })
    );
  }


}
