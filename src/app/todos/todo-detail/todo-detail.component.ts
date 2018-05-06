import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { now, Subproject, Todo } from '@app/model';
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
  onSelectProject(subproject: Subproject) {
    this.update({ subprojectId: subproject.id });
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
    this.timer.stop();
    this.isDoing = false;
    const endAt = now();
    const activities = this.todo.activities;
    activities.push({ startAt: this.startAt, endAt });
    const newTodo = merge(this.todo, { activities });
    this.todoService.update(newTodo);
    this.startAt = undefined;
  }
  onBack() {
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }
  onFinish() {
    this.todoService.finish(this.todo.id);
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }

  private update(data: any) {
    const title = this.titleControl.getValue();
    if (title) {
      this.hasError = false;
      const todo = merge(this.todo, {
        ...data,
        updatedAt: now()
      });
      this.todoService.update(todo);
    } else {
      this.hasError = true;
    }
  }
}
