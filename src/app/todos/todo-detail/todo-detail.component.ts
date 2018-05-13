import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, ProjectService, TodoService } from '@app/core';
import {
  EventType,
  isAfterToday,
  isBeforeToday,
  isFinished,
  isTodayStarted,
  mapTodoStatusEvent,
  milisecondToMinute,
  MonsterEvents,
  now,
  Subproject,
  TimeRangeType,
  Todo,
  TodoStatus,
} from '@app/model';
import { DatepickerResult, InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { addDays, isToday } from 'date-fns';
import { merge } from 'ramda';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

import { TodoTimerComponent } from './todo-timer/todo-timer.component';

@Component({
  selector: 'mst-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})
export class TodoDetailComponent extends Unsub implements OnInit {
  @ViewChild(TodoTimerComponent) timer: TodoTimerComponent;
  todo: Todo;
  titleControl = new InputControl('');
  noteControl = new InputControl('');
  hasError = false;
  currentSubproject: Subproject;
  status: TodoStatus;

  datePickerStartDate: number;
  TimeRangeType = TimeRangeType;

  showSomedayStatus = true;
  startAt: number;
  isDoing = false;
  finished = true;

  constructor(
    private eventService: EventService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService) {
      super();
    }

  ngOnInit() {
    this.datePickerStartDate = isTodayStarted() ? addDays(now(), 1).getTime() : now();

    this.addSubscription(
      this.todoService.getById(+this.route.snapshot.paramMap.get('id')).pipe(
        tap(todo => {
          this.todo = todo;
          this.titleControl.setValue(this.todo.title);
          this.noteControl.setValue(this.todo.note);
          this.status = this.todo.status;
          this.showSomedayStatus = !isTodayStarted() || isAfterToday(this.todo.happenDate);
          this.finished = !isFinished(this.todo);
        }),
        switchMap(todo => this.projectService.getSubprojectById(this.todo.subprojectId))
      ).subscribe(subproject => {
        this.currentSubproject = subproject;
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
  onSelectSubproject(subproject: Subproject) {
    this.currentSubproject = subproject;
    this.update({ subprojectId: subproject.id });
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
    } else {
      this.update({ status, finishAt: undefined });
    }
  }
  disableDatePicker() {
    return !this.finished || isBeforeToday(this.todo.happenDate) || (isToday(this.todo.happenDate) && isTodayStarted());
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
    this.projectService.updateSubprojectStartEndDateWithTodo(newTodo);

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
  }
  onBack() {
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }

  private emitEvent(data: any) {
    const event = {
      ...data,
      createdAt: now(),
      refId: this.todo.id,
      type: EventType.Todo
    };
    this.eventService.add(event);
  }
  private update(data: any) {
    const title = this.titleControl.getValue();
    if (title) {
      this.hasError = false;
      this.todo = merge(this.todo, {
        ...data,
        updatedAt: now()
      });
      this.addSubscription(
        this.todoService.update(this.todo).subscribe(success => {
        })
      );
    } else {
      this.hasError = true;
    }
  }
}
