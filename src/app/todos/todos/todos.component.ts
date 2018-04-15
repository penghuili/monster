import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { filterTodos, getDragImageOffsetFunction, moveItem, Project, Todo } from '@app/model';
import { NotificationService } from '@app/shared';
import { ROUTES, Unsub } from '@app/static';
import { DndDropEvent } from 'ngx-drag-drop';
import { combineLatest } from 'rxjs/observable/combineLatest';

@Component({
  selector: 'mst-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  inProgress: Todo[];
  inProgressLength: number;
  doneRecently: Todo[];
  doneRecentlyLength: number;
  currentProject: Project;

  dragImageOffsetFunction = getDragImageOffsetFunction();
  private draggingIndex: number;

  constructor(
    private notificationService: NotificationService,
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
    this.addSubscription(
      combineLatest(
        this.todoService.getDoneRecently(),
        this.projectService.getCurrent()
      ).subscribe(([ todos, currentProject ]) => {
        this.doneRecently = filterTodos(todos, currentProject);
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

  // go to create/edit todo
  onGotoCreate() {
    this.router.navigate([ ROUTES.CREATE ], { relativeTo: this.route });
  }
  onShowDetail(todo: Todo) {
    this.router.navigate([ todo.id ], { relativeTo: this.route });
  }

  // drag and drop
  onDragStart(todoIndex: number) {
    this.draggingIndex = todoIndex;
  }
  onDrop(event: DndDropEvent) {
    if (event.index !== undefined && event.data) {
      const to = event.index > this.draggingIndex ? event.index - 1 : event.index;
      if (to !== this.draggingIndex) {
        this.todoService.updateInProgress(moveItem(this.draggingIndex, to, this.inProgress));
      }
    }
    this.draggingIndex = undefined;
  }
}
