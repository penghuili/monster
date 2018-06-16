import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { ReportService } from '@app/core';
import { Event, EventType, TimeRangeType } from '@app/model';
import { Unsub } from '@app/static';
import { merge} from 'ramda';

@Component({
  selector: 'mst-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent extends Unsub implements OnChanges {
  @Input() date: number;
  @Input() mode: TimeRangeType;
  @ViewChild('activityWrapper') wrapper: ElementRef;
  activities: Event[] = [];
  isLoading: boolean;

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
    this.addSubscription(
      this.reportService.getActivities(date, mode).subscribe(value => {
        this.isLoading = false;
        if (value) {
          const projects = value.projects;
          const subprojects = value.subprojects;
          const todos = value.todos;
          const thoughts = value.thoughts;
          this.activities = (<Event[]>value.activities).map(a => {
            let data: any;
            if (a.type === EventType.Project) {
              data = projects.find(b => b.id === a.refId);
            } else if (a.type === EventType.Subproject) {
              data = subprojects.find(b => b.id === a.refId);
            } else if (a.type === EventType.Thought) {
              data = thoughts.find(b => b.id === a.refId);
            } else {
              data = todos.find(b => b.id === a.refId);
            }
            return merge(a, {data});
          });
        }
      })
    );
  }


}
