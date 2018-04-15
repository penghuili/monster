import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { now, Project, Todo } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { merge } from 'ramda';


@Component({
  selector: 'mst-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})
export class TodoDetailComponent extends Unsub implements OnInit {
  todo: Todo;
  titleControl = new InputControl('');
  noteControl = new InputControl('');
  days: number;
  hours: number;
  happenOn: number;
  hasError = false;

  currentProject: Project;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService) {
      super();
    }

  ngOnInit() {
    this.addSubscription(
      this.todoService.getById(this.route.snapshot.paramMap.get('id')).subscribe(todo => {
        this.todo = todo;
        this.currentProject = this.projectService.getById(this.todo.projectId);
        this.titleControl.setValue(this.todo.title);
        this.noteControl.setValue(this.todo.note);
        this.days = todo.days;
        this.hours = todo.hours;
        this.happenOn = todo.happenOn;
      })
    );
  }

  onDayChange(days: number) {
    this.days = days;
  }
  onHourChange(hours: number) {
    this.hours = hours;
  }
  onSelectProject(project: Project) {
    this.currentProject = project;
  }
  onFinishPickDate(date: number) {
    this.happenOn = date;
  }
  onCancel() {
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }
  onUpdate() {
    const title = this.titleControl.getValue();
    const note = this.noteControl.getValue();
    const days = this.days;
    const hours = this.hours;
    const project = this.currentProject;
    const happenOn = this.happenOn;
    if (title) {
      this.hasError = false;
      const todo = merge(this.todo, {
        title, note, days, hours, happenOn,
        projectId: project.id,
        updatedAt: now()
      });
      this.todoService.update(todo);
      this.router.navigate([ '../' ], { relativeTo: this.route });
    } else {
      this.hasError = true;
    }
  }
}
