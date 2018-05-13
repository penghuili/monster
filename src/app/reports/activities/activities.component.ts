import { Component, Input, OnChanges } from '@angular/core';
import { ReportService } from '@app/core';
import { Event, EventType, now, Project, Record, Subproject, TimeRangeType, Todo } from '@app/model';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent extends Unsub implements OnChanges {
  @Input() date: number;
  @Input() mode: TimeRangeType;
  activities: Event[] = [];
  data: (Project | Subproject | Todo | Record)[];
  isLoading: boolean;

  private _date = now();

  constructor(private reportService: ReportService) {
    super();
  }

  ngOnChanges() {
    if (this.date && this.mode !== undefined) {
      this.getActivities(this.date, this.mode);
    }
  }
  private getActivities(date: number, mode: TimeRangeType) {
    this.isLoading = true;
    this.activities = [];
    this.data = [];
    this.addSubscription(
      this.reportService.getActivities(date, mode).subscribe(value => {
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
