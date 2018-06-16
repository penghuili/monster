import { Component, Input, OnInit } from '@angular/core';
import { EventService, TodoService } from '@app/core';
import { Event, EventType, MonsterStorage, Todo } from '@app/model';
import { Unsub } from '@app/static';
import { merge } from 'ramda';
import { filter, startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-todo-activities',
  templateUrl: './todo-activities.component.html',
  styleUrls: ['./todo-activities.component.scss']
})
export class TodoActivitiesComponent extends Unsub implements OnInit {
  @Input() todo: Todo;

  EVENT = 'activities';
  THOUGHTS = 'thoughts';

  activities: Event[];
  activityTabs = [
    {key: this.EVENT, value: this.EVENT},
    {key: this.THOUGHTS, value: this.THOUGHTS}
  ];
  defaultTab: string;
  currentTab: string;

  private eventActivities: Event[];
  private thoughtActivities: Event[];
  private shouldLoadEvents = new Subject<boolean>();
  private shouldLoadThoughts = new Subject<boolean>();

  constructor(
    private eventService: EventService,
    private todoService: TodoService) {
      super();
  }

  ngOnInit() {
    this.getDefaultTab();

    this.addSubscription(
      this.shouldLoadEvents.asObservable().pipe(
        startWith(true),
        filter(() => !!this.todo && !!this.todo.id),
        switchMap(() => this.eventService.getEventsByTodoId(this.todo.id))
      ).subscribe(events => {
        events = events || [];
        this.eventActivities = events.map(a => merge(a, {data: this.todo}));

        this.onChangeTab(this.currentTab);
      })
    );

    this.addSubscription(
      this.shouldLoadThoughts.asObservable().pipe(
        startWith(true),
        filter(() => !!this.todo && !!this.todo.id),
        switchMap(() => this.todoService.getTodoThoughts(this.todo.id))
      ).subscribe(thoughts => {
        thoughts = thoughts || thoughts;
        this.thoughtActivities = thoughts.map(a => ({
          id: a.id,
          refId: a.todoId,
          action: undefined,
          createdAt: a.createdAt,
          type: EventType.TodoThought,
          data: {todo: this.todo, thought: a}
        }));

        this.onChangeTab(this.currentTab);
      })
    );
  }

  onChangeTab(key: string) {
    this.currentTab = key;
    MonsterStorage.set('todo-detail-activity-tab', key);
    if (this.currentTab === this.EVENT) {
      this.activities = this.eventActivities;
    } else {
      this.activities = this.thoughtActivities;
    }
  }
  loadActivities() {
    this.shouldLoadEvents.next(true);
  }
  loadThoughts() {
    this.shouldLoadThoughts.next(true);
  }

  private getDefaultTab() {
    this.defaultTab = MonsterStorage.get('todo-detail-activity-tab') || this.EVENT;
    this.currentTab = this.defaultTab;
  }

}
