import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Project } from '../../model/project';
import { InputControl } from '../../shared/input/input-control';
import { Unsub } from '../../static/class/unsub';
import { INBOX } from '../../static/config';
import { ProjectService } from '../services/project.service';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'monster-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class TodoCreateComponent extends Unsub implements OnInit {
  titleControl = new InputControl('');
  noteControl = new InputControl('');
  hoursControl = new InputControl('');
  hasError = false;

  currentProject: Project = INBOX;
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
      this.projectService.getCurrent().subscribe(p => {
        this.currentProject = p;
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
  onCreate() {
    const title = this.titleControl.getValue();
    const note = this.noteControl.getValue();
    const hours = +this.hoursControl.getValue();
    const project = this.currentProject;
    if (title) {
      this.hasError = false;
      const todo = { title, note, projectId: project.id, hours };
      this.todoService.create(todo);
      this.router.navigate([ '../' ], { relativeTo: this.route });
    } else {
      this.hasError = true;
    }
  }
  onCancel() {
    this.router.navigate([ '../' ], { relativeTo: this.route });
  }
}
