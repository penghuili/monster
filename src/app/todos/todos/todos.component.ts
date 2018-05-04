import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { filterTodos, moveItem, Project, Todo } from '@app/model';
import { ROUTES, Unsub } from '@app/static';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'mst-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  inProgress: Todo[];
  inProgressLength: number;
  currentProject: Project;

  dragIndex: number;

  TODAY = 'today';
  IN3DAYS = '3days';
  IN7DAYS = '7days';
  activeTab = this.TODAY;

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
        this.inProgress = filterTodos(todos, currentProject);
        this.inProgressLength = this.inProgress.length;
      })
    );
  }

  onChangeTab(tab: string) {
    this.activeTab = tab;
  }
  onFinish(id: string) {
    this.todoService.finish(id);
  }
  onGotoCreate() {
    this.router.navigate([ ROUTES.CREATE ], { relativeTo: this.route });
  }
  onShowDetail(todo: Todo) {
    this.router.navigate([ todo.id ], { relativeTo: this.route });
  }
  onDragStart(dragIndex: number) {
    this.dragIndex = dragIndex;
  }
  onDrop(dropIndex: number) {
    this.todoService.updateInProgress(moveItem(this.dragIndex, dropIndex, this.inProgress));
  }
}
