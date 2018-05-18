import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, ProjectService, SubprojectService, TodoService } from '@app/core';
import {
  Event,
  EventType,
  isAfterToday,
  isBeforeToday,
  isFinished,
  isTodayStarted,
  isWithin,
  mapTodoStatusEvent,
  milisecondToMinute,
  MonsterEvents,
  now,
  Project,
  ProjectWithSubproject,
  Subproject,
  TimeRangeType,
  Todo,
  TodoStatus,
} from '@app/model';
import { DatepickerResult, InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { addDays, isToday } from 'date-fns';
import { merge } from 'ramda';
import { of } from 'rxjs/observable/of';
import { debounceTime, startWith, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

import { TodoTimerComponent } from './todo-timer/todo-timer.component';

@Component({
  selector: 'mst-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})
export class TodoDetailComponent extends Unsub implements OnInit {
  @ViewChild(TodoTimerComponent) timer: TodoTimerComponent;
  todo: Todo;
  titleControl = new InputControl({ required: true });
  noteControl = new InputControl();
  currentThoughtControl = new InputControl();
  currentSubproject: Subproject;
  status: TodoStatus;

  datePickerStartDate: number;
  datePickerEndDate: number;
  TimeRangeType = TimeRangeType;

  showSomedayStatus = true;
  startAt: number;
  isDoing = false;
  finished = true;

  activities: Event[];
  private laodEvents = new Subject<boolean>();

  constructor(
    private eventService: EventService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private subprojectService: SubprojectService,
    private todoService: TodoService) {
      super();
    }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.datePickerStartDate = isTodayStarted() ? addDays(now(), 1).getTime() : now();

    this.addSubscription(
      this.todoService.getById(id).pipe(
        tap(todo => {
          this.todo = todo;
          this.titleControl.setValue(this.todo.title);
          this.noteControl.setValue(this.todo.note);
          this.status = this.todo.status;
          this.showSomedayStatus = !isTodayStarted() || isAfterToday(this.todo.happenDate);
          this.finished = isFinished(this.todo);
        }),
        switchMap(todo => todo ? this.subprojectService.getSubprojectById(this.todo.subprojectId) : of(null)),
        switchMap(subproject => {
          this.currentSubproject = subproject;
          return subproject ? this.projectService.getProjectById(subproject.projectId) : of(null);
        })
      ).subscribe((project: Project) => {
        this.setDatepickerRange(project);
      })
    );

    this.addSubscription(
      this.laodEvents.asObservable().pipe(
        startWith(true),
        switchMap(() => this.eventService.getEventsByTodoId(id))
      ).subscribe(activities => {
        this.activities = activities ? activities : [];
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
      this.noteControl.value$.pipe(
        debounceTime(300)
      ).subscribe(note => {
        this.update({ note });
      })
    );
  }

  onDurationChange(duration: number) {
    this.emitEvent({
      action: MonsterEvents.ChangeTodoExpectedTime,
      oldValue: this.todo.expectedTime,
      newValue: duration
    });
    this.update({ expectedTime: duration });
  }
  onSelectSubproject(selected: ProjectWithSubproject) {
    this.currentSubproject = selected.subproject;
    this.update({ subprojectId: this.currentSubproject.id });
    this.setDatepickerRange(selected.project);
  }
  onSelectStatus(status: TodoStatus) {
    const action = mapTodoStatusEvent(status);
    this.emitEvent({
      action,
      oldValue: this.todo.status,
      newValue: status
    });

    this.status = status;
    const timestamp = now();
    this.finished = false;
    if (status === TodoStatus.Done || status === TodoStatus.WontDo) {
      this.finished = true;
      if (this.isDoing) {
        this.onStop();
      }
      const data = {
        finishAt: timestamp,
        status
      };
      this.update(data);
    } else if (status === TodoStatus.Someday) {
      const twoWeeksLater = addDays(now(), 14).getTime();
      const happenDate = twoWeeksLater > this.todo.happenDate ? twoWeeksLater : this.todo.happenDate;
      const data = { status, happenDate };
      this.update(data);
    } else if (this.todo.status === TodoStatus.Someday) {
      const data = {
        status,
        happenDate: now()
      };
      this.update(data);
    } else {
      this.update({ status, finishAt: undefined });
    }
  }
  disableDatePicker() {
    return this.finished || isBeforeToday(this.todo.happenDate) || (isToday(this.todo.happenDate) && isTodayStarted());
  }
  onFinishPickDate(result: DatepickerResult) {
    this.emitEvent({
      action: MonsterEvents.ChangeTodoHappenDate,
      oldValue: this.todo.happenDate,
      newValue: result.date
    });

    const newTodo = merge(this.todo, {
      happenDate: result.date,
      updatedAt: now()
    });

    this.update({ happenDate: result.date });
  }
  onStart() {
    if (!this.isDoing) {
      this.isDoing = true;
      this.timer.start();
      this.startAt = now();
      this.emitEvent({ action: MonsterEvents.StartTodo });
    }
  }
  onStop() {
    this.timer.stop();
    this.isDoing = false;
    this.emitEvent({ action: MonsterEvents.StopTodo });

    const data = {
      usedTime: this.todo.usedTime + Math.round(milisecondToMinute(now() - this.startAt))
    };
    this.update(data);
    this.startAt = undefined;
  }
  onAddCurrentThought() {
    const thought = this.currentThoughtControl.getValue();
    if (thought) {
      this.emitEvent({ action: MonsterEvents.CurrentThougntTodo, newValue: thought });
    }
  }
  onBack() {
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }

  private setDatepickerRange(project: Project) {
    this.datePickerStartDate = project && project.startDate > this.datePickerStartDate ? project.startDate : this.datePickerStartDate;
    this.datePickerEndDate = project ? project.endDate : undefined;

    if (project && this.todo && this.todo.status !== TodoStatus.Someday &&
      !isWithin(this.todo.happenDate, project.startDate, project.endDate)) {
        this.update({ happenDate: this.datePickerStartDate });
        alert(`your todo's date is out of project ${project.title}'s range. please reselect date.`);
    }
  }
  private emitEvent(data: any) {
    const event = {
      ...data,
      createdAt: now(),
      refId: this.todo.id,
      type: EventType.Todo
    };
    this.eventService.add(event).subscribe(success => {
      if (success) {
        this.laodEvents.next(true);
        this.currentThoughtControl.reset();
      }
    });
  }
  private update(data: any) {
    if (this.titleControl.valid) {
      this.todo = merge(this.todo, {
        ...data,
        updatedAt: now()
      });
      this.addSubscription(
        this.todoService.update(this.todo).subscribe(success => {
        })
      );
    }
  }
}
