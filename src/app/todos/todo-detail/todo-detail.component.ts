import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService, InputService, ProjectService, ReportService, SubprojectService, TodoService } from '@app/core';
import {
  EventType,
  isAfterToday,
  isBeforeToday,
  isFinished,
  isFinishTooLate,
  isRedoingOverdue,
  isTodayStarted,
  isWithin,
  mapTodoStatusEvent,
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
import { debounceTime, switchMap, tap } from 'rxjs/operators';

import { TodoActivitiesComponent } from './todo-activities/todo-activities.component';
import { TodoTimerComponent } from './todo-timer/todo-timer.component';

@Component({
  selector: 'mst-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})
export class TodoDetailComponent extends Unsub implements OnInit {
  @ViewChild(TodoTimerComponent) timer: TodoTimerComponent;
  @ViewChild(TodoActivitiesComponent) activities: TodoActivitiesComponent;
  todo: Todo;
  titleControl = new InputControl<string>({ required: true });
  noteControl = new InputControl<string>();
  whyTooLateControl = new InputControl<string>();
  currentThoughtControl = new InputControl<string>();
  currentSubproject: Subproject;
  status: TodoStatus;

  defaultDatepickerDate: number;
  datePickerStartDate: number;
  datePickerEndDate: number;
  TimeRangeType = TimeRangeType;

  showSomedayStatus = true;
  startAt: number;
  isDoing = false;
  finished = false;
  finishedTooLate = false;

  hideUpDownArrow = false;

  private currentProject: Project;

  constructor(
    private eventService: EventService,
    private inputService: InputService,
    private projectService: ProjectService,
    private reportService: ReportService,
    private route: ActivatedRoute,
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
          if (todo) {
            this.titleControl.setValue(this.todo.title);
            this.noteControl.setValue(this.todo.note);
            this.whyTooLateControl.setValue(this.todo.whyTooLate);
            this.status = this.todo.status;
            this.showSomedayStatus = !isTodayStarted() || isAfterToday(this.todo.happenDate);
            this.finished = isFinished(this.todo);
            this.finishedTooLate = isFinishTooLate(this.todo);
            this.defaultDatepickerDate = this.todo.happenDate;
          }
        }),
        switchMap(todo => todo ? this.subprojectService.getSubprojectById(this.todo.subprojectId) : of(null)),
        switchMap(subproject => {
          this.currentSubproject = subproject;
          return subproject ? this.projectService.getProjectById(subproject.projectId) : of(null);
        })
      ).subscribe((project: Project) => {
        this.currentProject = project;
        this.setDatepickerRange(project);
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

    this.addSubscription(
      this.whyTooLateControl.value$.pipe(
        debounceTime(300)
      ).subscribe(whyTooLate => {
        this.update({ whyTooLate });
      })
    );

    this.addSubscription(
      this.inputService.getFocusStatus().subscribe(focus => {
        this.hideUpDownArrow = focus;
      })
    );
  }

  onDurationChange(duration: number) {
    this.emitEvent({
      action: MonsterEvents.ChangeTodoExpectedTime,
      oldValue: this.todo.expectedTime,
      newValue: duration * 60
    });

    this.update({ expectedTime: duration * 60 });
  }
  onSelectSubproject(selected: ProjectWithSubproject) {
    this.currentProject = selected.project;
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
    if (status === TodoStatus.Done || status === TodoStatus.WontDo) {
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

    this.setDatepickerRange(this.currentProject);
  }
  disableDatePicker() {
    return this.finished ||
    (!isRedoingOverdue() &&
      (isBeforeToday(this.todo.happenDate) || (isToday(this.todo.happenDate) && isTodayStarted()))
    );
  }
  onFinishPickDate(result: DatepickerResult) {
    this.emitEvent({
      action: MonsterEvents.ChangeTodoHappenDate,
      oldValue: this.todo.happenDate,
      newValue: result.date
    });
    const happenDateChangedTimes = this.todo.happenDateChangedTimes ? this.todo.happenDateChangedTimes : 0;
    this.update({ happenDate: result.date, happenDateChangedTimes: happenDateChangedTimes + 1 });
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

    const usedTime = Math.round((now() - this.startAt) / 1000);
    const data = {
      usedTime: this.todo.usedTime + usedTime
    };
    this.update(data);

    this.emitEvent({ action: MonsterEvents.StopTodo });
    this.reportService.updateTodayUsedTime(usedTime).subscribe();

    this.startAt = undefined;
  }
  onAddCurrentThought() {
    const thought = this.currentThoughtControl.getValue();
    if (thought) {
      this.addSubscription(
        this.todoService.addTodoThought({
          todoId: this.todo.id,
          createdAt: now(),
          thought
        }).subscribe(success => {
          if (success) {
            this.activities.loadThoughts();
            this.currentThoughtControl.reset();
          }
        })
      );
    }
  }

  private setDatepickerRange(project: Project) {
    this.datePickerStartDate = project && project.startDate > this.datePickerStartDate ? project.startDate : this.datePickerStartDate;
    this.datePickerEndDate = project && this.todo && this.todo.status !== TodoStatus.Someday ? project.endDate : undefined;

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
        this.activities.loadActivities();
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

      this.finished = isFinished(this.todo);
      this.finishedTooLate = isFinishTooLate(this.todo);

      this.addSubscription(
        this.todoService.update(this.todo).subscribe(success => {
        })
      );
    }
  }
}
