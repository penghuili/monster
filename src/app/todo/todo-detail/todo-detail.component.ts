import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'ramda';

import { Project } from '../../model/project';
import { Todo } from '../../model/todo';
import { now } from '../../model/utils';
import { InputControl } from '../../shared/input/input-control';
import { Unsub } from '../../static/class/unsub';
import { ProjectService } from '../services/project.service';
import { TodoService } from '../services/todo.service';

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
  onCancel() {
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }
  onUpdate() {
    const title = this.titleControl.getValue();
    const note = this.noteControl.getValue();
    const hours = +this.hoursControl.getValue();
    const project = this.currentProject;
    if (title) {
      this.hasError = false;
      const todo = merge(this.todo, { title, note, projectId: project.id, hours, updatedAt: now() });
      this.todoService.update(todo);
      this.router.navigate([ '../' ], { relativeTo: this.route });
    } else {
      this.hasError = true;
    }
  }

}
