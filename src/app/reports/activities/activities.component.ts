import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { ReportService, TodoService } from '@app/core';
import { Event, EventType, TimeRangeType } from '@app/model';
import { Unsub } from '@app/static';
import { merge} from 'ramda';
import { combineLatest } from 'rxjs/observable/combineLatest';

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

  constructor(
    private reportService: ReportService,
    private todoService: TodoService) {
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
      combineLatest(
        this.reportService.getActivities(date, mode),
        this.todoService.getThoughts(date, mode)
      )
      .subscribe(([events, todoThoughts]) => {
        this.isLoading = false;
        if (events && todoThoughts) {
          const projects = events.projects;
          const subprojects = events.subprojects;
          const todos = events.todos;
          const thoughts = events.thoughts;
          const habits = events.habits;
          const todoThoughtsActivities = todoThoughts.map(thought => {
            const todo = todos.find(b => b.id === thought.todoId);
            return {
              id: thought.id,
              refId: thought.todoId,
              action: undefined,
              createdAt: thought.createdAt,
              type: EventType.TodoThought,
              data: {todo, thought}
            };
          });

          this.activities = (<Event[]>events.activities)
          .map(a => {
            let data: any;
            if (a.type === EventType.Project) {
              data = projects.find(b => b.id === a.refId);
            } else if (a.type === EventType.Subproject) {
              data = subprojects.find(b => b.id === a.refId);
            } else if (a.type === EventType.Thought) {
              data = thoughts.find(b => b.id === a.refId);
            } else if (a.type === EventType.Habit) {
              data = habits.find(b => b.id === a.refId);
            } else {
              data = todos.find(b => b.id === a.refId);
            }
            return merge(a, {data});
          })
          .concat(todoThoughtsActivities)
          .sort((a, b) => a.createdAt - b.createdAt);
        }
      })
    );
  }


}
