import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Project } from '../../model/project';
import { Todo } from '../../model/todo';
import { Unsub } from '../../static/class/unsub';
import { ROUTES } from '../../static/routes';
import { ProjectsComponent } from '../projects/projects.component';
import { ProjectService } from '../services/project.service';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'monster-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  @ViewChild(ProjectsComponent) projectsC: ProjectsComponent;
  inProgress: Todo[];
  inProgressLength: number;
  doneRecently: Todo[];
  doneRecentlyLength: number;

  projects: Project[];
  currentProject: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.todoService.getInProgress().subscribe(data => {
        this.inProgress = data;
        this.inProgressLength = this.inProgress.length;
      })
    );
    this.addSubscription(
      this.todoService.getDoneRecently().subscribe(data => {
        this.doneRecently = data;
        this.doneRecentlyLength = data.length;
      })
    );
    this.addSubscription(
      this.projectService.getProjects().subscribe(data => {
        this.projects = data;
      })
    );
    this.currentProject = this.projectService.getCurrent();
  }

  onCreate() {
    this.router.navigate([ ROUTES.CREATE ], { relativeTo: this.route });
  }
  onClick(id: string) {
  }
  onFinish(id: string) {
    this.todoService.finishTodo(id);
  }

  onUndo(id: string) {
    this.todoService.undoTodo(id);
  }
  onDelete(id: string) {
  }

  onShowProjects() {
    this.projectsC.show();
  }
  onChangeProject(project: Project) {
    this.currentProject = project;
    this.projectService.setCurrent(project);
  }

}
