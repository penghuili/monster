import { Component, Input } from '@angular/core';
import { ReportService } from '@app/core';
import { Event, EventType, now, Project, Record, Subproject, Todo } from '@app/model';
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
  data: (Project | Subproject | Todo | Record)[];
  isLoading: boolean;

  private _date = now();

  constructor(private reportService: ReportService) {
    super();
  }

  private getActivities(date: number) {
    this.isLoading = true;
    this.activities = [];
    this.data = [];
    this.addSubscription(
      this.reportService.getActivities(date).subscribe(value => {
        this.isLoading = false;
        if (value) {
          this.activities = value.activities;
          const projects = value.projects;
          const subprojects = value.subprojects;
          const todos = value.todos;
          const records = value.records;
          this.data = this.activities.map(a => {
            if (a.type === EventType.Project) {
              return projects.find(b => b.id === a.refId);
            } else if (a.type === EventType.Subproject) {
              return subprojects.find(b => b.id === a.refId);
            } else if (a.type === EventType.Record) {
              return records.find(b => b.id === a.refId);
            } else {
              return todos.find(b => b.id === a.refId);
            }
          });
        }
      })
    );
  }


}
