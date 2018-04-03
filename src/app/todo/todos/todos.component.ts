import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Project } from '../../model/project';
import { filterTodo, Todo } from '../../model/todo';
import { Unsub } from '../../static/class/unsub';
import { ProjectsComponent } from '../projects/projects.component';
import { ProjectService } from '../services/project.service';
import { TodoService } from '../services/todo.service';
import { TodoCreateComponent } from '../todo-create/todo-create.component';

@Component({
  selector: 'monster-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  @ViewChild(TodoCreateComponent) createC: TodoCreateComponent;
  @ViewChild(ProjectsComponent) projectsC: ProjectsComponent;
  inProgress: Todo[];
  inProgressLength: number;
  doneRecently: Todo[];
  doneRecentlyLength: number;
  currentTodo: Todo;
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
      combineLatest(
        this.todoService.getInProgress(),
        this.projectService.getCurrent()
      ).subscribe(([ todos, currentProject ]) => {
        this.currentProject = currentProject;
        this.inProgress = filterTodo(todos, currentProject);
        this.inProgressLength = this.inProgress.length;
      })
    );
    this.addSubscription(
      this.todoService.getDoneRecently().subscribe(data => {
        this.doneRecently = data;
        this.doneRecentlyLength = data.length;
      })
    );
  }

  // create/edit todo
  onShowCreate() {
    this.createC.show();
  }
  onShowDetail(todo: Todo) {
    this.currentTodo = todo;
    this.createC.show();
  }
  onNewTodo(todo: Todo) {
    if (this.currentTodo && todo.id === this.currentTodo.id) {
      this.todoService.update(todo);
    } else {
      this.todoService.create(todo);
    }
  }
  onCloseCreate() {
    this.currentTodo = undefined;
  }

  // finish/delete/undo
  onFinish(id: string) {
    this.todoService.finishTodo(id);
  }
  onDelete(id: string) {
  }
  onUndo(id: string) {
    this.todoService.undoTodo(id);
  }

  // switch projects
  onShowProjects() {
    this.projectsC.show();
  }
  onChangeProject(project: Project) {
    this.projectService.setCurrent(project);
  }

}
