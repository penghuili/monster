import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { now, Subproject, Todo, TodoStatus } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { merge } from 'ramda';
import { debounceTime, first, switchMap, tap } from 'rxjs/operators';

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

  isDoing = false;
  private startAt: number;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService) {
      super();
    }

  ngOnInit() {
    this.addSubscription(
      this.todoService.getById(this.route.snapshot.paramMap.get('id')).pipe(
        first(),
        tap(todo => {
          this.todo = todo;
          this.titleControl.setValue(this.todo.title);
          this.noteControl.setValue(this.todo.note);
          this.status = this.todo.status;
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
    this.update({ expectedTime: duration });
  }
  onSelectSubproject(subproject: Subproject) {
    this.currentSubproject = subproject;
    this.update({ subprojectId: subproject.id });
  }
  onSelectStatus(status: TodoStatus) {
    this.status = status;
    const timestamp = now();
    if (status === TodoStatus.Done) {
      let data: any = {};
      if (this.isDoing) {
        data = {
          activities: this.getStopData()
        };
      }
      data = {
        ...data,
        finishAt: timestamp,
        status: TodoStatus.Done,
        updatedAt: timestamp
      };
      this.update(data);
    } else {
      this.update({ status, finishAt: undefined });
    }
  }
  onFinishPickDate(date: number) {
    this.update({ happenDate: date });
  }
  onStart() {
    if (!this.isDoing) {
      this.isDoing = true;
      this.startAt = now();
      this.timer.start();
    }
  }
  onStop() {
    const newTodo = merge(this.todo, { activities: this.getStopData() });
    this.todoService.update(newTodo);
  }
  onBack() {
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }

  private update(data: any) {
    const title = this.titleControl.getValue();
    if (title) {
      this.hasError = false;
      this.todo = merge(this.todo, {
        ...data,
        updatedAt: now()
      });
      this.todoService.update(this.todo);
    } else {
      this.hasError = true;
    }
  }
  private getStopData() {
    this.timer.stop();
    this.isDoing = false;
    const endAt = now();
    const activities = this.todo.activities;
    activities.push({ startAt: this.startAt, endAt });
    this.startAt = undefined;
    return activities;
  }
}
