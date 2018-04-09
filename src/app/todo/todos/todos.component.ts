import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Project } from '../../model/project';
import { filterTodo, Todo } from '../../model/todo';
import { Unsub } from '../../static/class/unsub';
import { ROUTES } from '../../static/routes';
import { ProjectService } from '../services/project.service';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'monster-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  inProgress: Todo[];
  inProgressLength: number;
  doneRecently: Todo[];
  doneRecentlyLength: number;
  projects: Project[];
  currentProject: Project;
  showProjects: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    // this.todoService.process()
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
      combineLatest(
        this.todoService.getDoneRecently(),
        this.projectService.getCurrent()
      ).subscribe(([ todos, currentProject ]) => {
        this.doneRecently = filterTodo(todos, currentProject);
        this.doneRecentlyLength = this.doneRecently.length;
      })
    );
  }

  // finish/delete/undo
  onFinish(id: string) {
    this.todoService.finish(id);
  }
  onDelete(id: string) {
    this.todoService.deleteById(id);
  }
  onUndo(id: string) {
    this.todoService.undo(id);
  }

  // switch projects
  onShowProjects() {
    this.showProjects = true;
  }
  onChangeProject(project: Project) {
    this.projectService.setCurrent(project);
    this.showProjects = false;
  }

  // go to create/edit todo
  onGotoCreate() {
    this.router.navigate([ ROUTES.CREATE ], { relativeTo: this.route });
  }
  onShowDetail(todo: Todo) {
    this.router.navigate([ todo.id ], { relativeTo: this.route });
  }
}
