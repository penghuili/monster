import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import {
  endOfThisWeek,
  endOfToday,
  endofTomorrow,
  isTodayEnded,
  isTodayStarted,
  MonsterStorage,
  now,
  ProjectWithTodos,
  sortTodo,
  Todo,
  TodoStatus,
} from '@app/model';
import { ROUTES, Unsub } from '@app/static';
import { format } from 'date-fns';
import { merge } from 'ramda';
import { startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  activeProjectsWithTodos: ProjectWithTodos[];
  doneProjectsWithTodos: ProjectWithTodos[];

  activeTodosExpectedTime = 0;
  noTimeActiveTodosCount = 0;

  dragIndex: number;

  TODAY = 'today';
  TOMORROW = 'tomorrow';
  THISWEEK = 'this week';
  NEXTWEEK = 'next week';
  activeTab: string;

  todayStarted = false;
  todayEnded = false;

  activeTodos: Todo[];
  private todos: Todo[];
  private projectsWithTodos: ProjectWithTodos[];

  private drapProjectId: number;
  private shouldReload = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    this.todayStarted = isTodayStarted();
    this.todayEnded = isTodayEnded();
    this.activeTab = MonsterStorage.get('activeTab') || this.TODAY;

    this.addSubscription(
      this.shouldReload.asObservable().pipe(
        startWith(true),
        switchMap(() => this.todoService.get2Weeks()),
        switchMap(todos => {
          this.todos = todos;
          return this.projectService.getProjectsWithTodos(todos);
        })
      ).subscribe(projectsWithTodos => {
        this.projectsWithTodos = projectsWithTodos;
        this.process(this.activeTab, this.projectsWithTodos, this.todos);
      })
    );
  }

  onStartToday() {
    if (this.activeTab === this.TODAY) {
      const want = confirm('are you sure to start today now?');
      if (want) {
        if (!this.todayStarted) {
          this.todayStarted = true;
          MonsterStorage.set('start-today', now());
        }
      }
    }
  }
  onCallItADay() {
    if (this.activeTab === this.TODAY) {
      const want = confirm('are you sure to end today?');
      if (want) {
        if (!this.todayEnded) {
          this.todayEnded = true;
          MonsterStorage.set('end-today', now());
        }
      }
    }
  }
  onChangeTab(tab: string) {
    MonsterStorage.set('activeTab', tab);
    this.activeTab = tab;

    this.process(this.activeTab, this.projectsWithTodos, this.todos);
  }
  onCreate() {
    this.router.navigate([ ROUTES.CREATE ], { relativeTo: this.route });
  }
  onCreated() {
    this.shouldReload.next(true);
  }
  onShowDetail(todo: Todo) {
    this.router.navigate([ todo.id ], { relativeTo: this.route });
  }
  onDragStart(dragIndex: number, projectId: number) {
    this.dragIndex = dragIndex;
    this.drapProjectId = projectId;
  }
  onDrop(dropIndex: number, projectId: number) {
    // if (this.drapGroup === group && dropIndex !== this.dragIndex) {
    //   const dragged = this.activeTodoGroup[group][this.dragIndex];
    //   const dropped = this.activeTodoGroup[group][dropIndex];
    //   if (dragged && dropped && dragged.status === dropped.status &&
    //     dragged.status !== TodoStatus.Waiting && dropped.status !== TodoStatus.Waiting) {
    //       this.todoService.swap(dragged, dropped);
    //   }
    // }
    this.dragIndex = undefined;
    this.drapProjectId = undefined;
  }

  process(activeTab: string, projectsWithTodos: ProjectWithTodos[], todos: Todo[]) {
    this.calcTotal(activeTab, todos);
    this.processTodos(activeTab, projectsWithTodos);
  }
  private processTodos(activeTab: string, projectsWithTodos: ProjectWithTodos[]) {
    const todayEnd = endOfToday();
    const tomorrowEnd = endofTomorrow();
    const weekEnd = endOfThisWeek();
    let filteredActive: ProjectWithTodos[];
    let activeFilterFunction: (a: Todo) => boolean;
    if (activeTab === this.TODAY) {
      activeFilterFunction = a => a.happenDate - todayEnd <= 0;
    } else if (activeTab === this.TOMORROW) {
      activeFilterFunction = a => a.happenDate > todayEnd && a.happenDate <= tomorrowEnd;
    } else if (activeTab === this.THISWEEK) {
      activeFilterFunction = a => a.happenDate > tomorrowEnd && a.happenDate <= weekEnd;
    } else {
      activeFilterFunction = a => a.happenDate > weekEnd;
    }
    filteredActive = projectsWithTodos.map(pt => {
      const tds = pt.todos.filter(activeFilterFunction);
      return merge(pt, { todos: tds });
    });
    this.activeProjectsWithTodos = filteredActive.map(pt => {
      const tds = pt.todos
        .filter(a => a.status === TodoStatus.InProgress || a.status === TodoStatus.Waiting)
        .sort((a, b) => sortTodo(a, b));
      return merge(pt, { todos: tds });
    });

    this.doneProjectsWithTodos = projectsWithTodos.map(pt => {
      const tds = pt.todos
        .filter(a => this.isDoneOnToday(a))
        .sort((a, b) => b.finishAt - a.finishAt);
      return merge(pt, { todos: tds });
    });
  }
  private calcTotal(activeTab: string, todos: Todo[]) {
    const todayEnd = endOfToday();
    const tomorrowEnd = endofTomorrow();
    const weekEnd = endOfThisWeek();
    let filtered: Todo[];
    if (activeTab === this.TODAY) {
      filtered = todos.filter(a => a.happenDate - todayEnd <= 0);
    } else if (activeTab === this.TOMORROW) {
      filtered = todos.filter(a => a.happenDate > todayEnd && a.happenDate <= tomorrowEnd);
    } else if (activeTab === this.THISWEEK) {
      filtered = todos.filter(a => a.happenDate > tomorrowEnd && a.happenDate <= weekEnd);
    } else {
      filtered = todos.filter(a => a.happenDate > weekEnd);
    }

    this.activeTodos = filtered.filter(a => a.status === TodoStatus.InProgress || a.status === TodoStatus.Waiting);
    this.noTimeActiveTodosCount = this.activeTodos.filter(a => a.expectedTime === 0).length;
  }
  private isDoneOnToday(todo: Todo): boolean {
    return (todo.status === TodoStatus.Done || todo.status === TodoStatus.WontDo) &&
      format(todo.finishAt, 'YYYYMMDD') === format(now(), 'YYYYMMDD');
  }
}
