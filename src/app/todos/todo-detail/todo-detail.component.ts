import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { now, Project, Todo } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { merge } from 'ramda';


@Component({
  selector: 'monster-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss']
})
export class TodoDetailComponent extends Unsub implements OnInit {
  todo: Todo;
  titleControl = new InputControl('');
  noteControl = new InputControl('');
  hoursControl = new InputControl('');
  happenOn: number;
  hasError = false;

  currentProject: Project;
  showProjects = false;

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
        this.hoursControl.setValue(this.todo.hours ? this.todo.hours.toString() : '');
        this.happenOn = todo.happenOn;
      })
    );
  }

  onShowProjects() {
    this.showProjects = true;
  }
  onSelectProject(project: Project) {
    this.currentProject = project;
    this.showProjects = false;
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
    const hours = +this.hoursControl.getValue();
    const project = this.currentProject;
    const happenOn = this.happenOn;
    if (title) {
      this.hasError = false;
      const todo = merge(this.todo, {
        title, note, hours, happenOn,
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
