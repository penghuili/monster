import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHeaderService, ProjectService, TodoService } from '@app/core';
import {
  endofTomorrow,
  hasTodos,
  isBeforeToday,
  isFinished,
  isOverDue,
  isWithinDay,
  now,
  OVERDUE,
  ProjectStatus,
  ProjectWithTodos,
  sortTodos,
  TODAY,
  Todo,
  TodoStatus,
  TOMORROW,
} from '@app/model';
import { Unsub } from '@app/static';
import { isToday, isTomorrow } from 'date-fns';
import { merge } from 'ramda';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { merge as mergeO } from 'rxjs/observable/merge';
import { filter, startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  todos: Todo[];
  projectsWithTodos: ProjectWithTodos[];
  activeProjectsWithTodos: ProjectWithTodos[];
  doneProjectsWithTodos: ProjectWithTodos[];
  hasDone: boolean;

  dragIndex: number;
  activeTab: string;
  TODAY = TODAY;

  showSearch = false;

  private drapProjectId: number;
  private shouldReload = new Subject<boolean>();

  constructor(
    private appHeaderService: AppHeaderService,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    const todos$ = mergeO(
      this.shouldReload.asObservable().pipe(startWith(true)),
      this.todoService.onCreatedTodo()
    ).pipe(
      switchMap(() => this.todoService.getForTodoPage()),
      switchMap(todos => {
        this.todos = todos || [];
        return this.projectService.getProjectsWithTodos(todos);
      })
    );
    const tab$ = this.todoService.getActiveTab();
    this.addSubscription(
      combineLatest(todos$, tab$).pipe(
        filter(([projectsWithTodos, tab]) => !!projectsWithTodos && !!tab)
      ).subscribe(([projectsWithTodos, tab]) => {
        this.activeTab = tab;
        this.projectsWithTodos = projectsWithTodos.filter(a => a.project.status === ProjectStatus.InProgress);
        this.process(tab, this.projectsWithTodos, this.todos);
      })
    );

    this.addSubscription(
      this.appHeaderService.getSearchStatus().subscribe(isSearching => {
        this.showSearch = isSearching;
      })
    );
  }

  onShowDetail(todo: Todo) {
    this.router.navigate([ todo.id ], { relativeTo: this.route });
  }
  onDragStart(dragIndex: number, projectId: number) {
    this.dragIndex = dragIndex;
    this.drapProjectId = projectId;
  }
  onDrop(dropIndex: number, projectId: number) {
    if (this.drapProjectId === projectId && dropIndex !== this.dragIndex) {
      const projectWithTodos = this.activeProjectsWithTodos.find(a => a.project.id === this.drapProjectId);
      const dragged = projectWithTodos ? projectWithTodos.todos[this.dragIndex] : null;
      const dropped = projectWithTodos ? projectWithTodos.todos[dropIndex] : null;
      if (this.bothAreOverdue(dragged, dropped) ||
        this.bothAreNotOverdueAndInProgress(dragged, dropped) ||
        this.bothAreWaiting(dragged, dropped)) {
          this.addSubscription(
            this.todoService.repositionTodos(dragged, dropped).subscribe(success => {
              if (success) {
                this.shouldReload.next(true);
              }
            })
          );
      }
    }
    this.dragIndex = undefined;
    this.drapProjectId = undefined;
  }

  private bothAreOverdue(dragged: Todo, dropped: Todo): boolean {
    return dragged && dropped && isOverDue(dragged) && isOverDue(dropped);
  }
  private bothAreNotOverdueAndInProgress(dragged: Todo, dropped: Todo): boolean {
    return dragged && dropped && !isOverDue(dragged) && !isOverDue(dropped) &&
      dragged.status === TodoStatus.InProgress && dropped.status === TodoStatus.InProgress;
  }
  private bothAreWaiting(dragged: Todo, dropped: Todo): boolean {
    return dragged && dropped && dragged.status === TodoStatus.Someday && dropped.status === TodoStatus.Someday;
  }
  private process(activeTab: string, projectsWithTodos: ProjectWithTodos[], todos: Todo[]) {
    this.processTodos(activeTab, projectsWithTodos);
    this.calcTotal(activeTab, todos);
  }
  private processTodos(activeTab: string, projectsWithTodos: ProjectWithTodos[]) {
    const tomorrowEnd = endofTomorrow();
    let filteredActive: ProjectWithTodos[];
    let activeFilterFunction: (a: Todo) => boolean;
    if (activeTab === OVERDUE) {
      activeFilterFunction = a => isBeforeToday(a.happenDate);
    } else if (activeTab === TODAY) {
      activeFilterFunction = a => isToday(a.happenDate);
    } else if (activeTab === TOMORROW) {
      activeFilterFunction = a => isTomorrow(a.happenDate);
    } else {
      activeFilterFunction = a => a.happenDate > tomorrowEnd;
    }
    filteredActive = projectsWithTodos.map(pt => {
      const tds = pt.todos.filter(activeFilterFunction);
      return merge(pt, { todos: tds });
    });
    this.activeProjectsWithTodos = filteredActive.map(pt => {
      const tds = pt.todos.filter(a => !isFinished(a));
      const sorted = sortTodos(tds);
      return merge(pt, { todos: sorted });
    });

    this.doneProjectsWithTodos = projectsWithTodos.map(pt => {
      const tds = pt.todos
        .filter(a => this.isDoneOnToday(a))
        .sort((a, b) => b.finishAt - a.finishAt);
      return merge(pt, { todos: tds });
    });
    this.hasDone = hasTodos(this.doneProjectsWithTodos);
  }
  private calcTotal(activeTab: string, todos: Todo[]) {
    const tomorrowEnd = endofTomorrow();
    let filtered: Todo[];
    if (activeTab === OVERDUE) {
      filtered = todos.filter(a => isBeforeToday(a.happenDate));
    } else if (activeTab === TODAY) {
      filtered = todos.filter(a => isToday(a.happenDate));
    } else if (activeTab === TOMORROW) {
      filtered = todos.filter(a => isTomorrow(a.happenDate));
    } else {
      filtered = todos.filter(a => a.happenDate > tomorrowEnd);
    }

    const activeTodos = filtered.filter(a => a.status === TodoStatus.InProgress);
    this.appHeaderService.sendData(activeTodos);
  }
  private isDoneOnToday(todo: Todo): boolean {
    return isFinished(todo) && isWithinDay(todo.finishAt, now());
  }
}
