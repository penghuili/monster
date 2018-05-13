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
  Project,
  sortTodo,
  Todo,
  TodoGroup,
  TodoStatus,
} from '@app/model';
import { ROUTES, Unsub } from '@app/static';
import { format } from 'date-fns';
import { groupBy, keys } from 'ramda';
import { startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  activeTodoGroup: TodoGroup;
  activeGroups: string[];
  activeTodosExpectedTime = 0;
  noTimeActiveTodosCount = 0;
  doneTodoGroup: TodoGroup;
  doneGroups: string[];

  dragIndex: number;

  TODAY = 'today';
  TOMORROW = 'tomorrow';
  THISWEEK = 'this week';
  activeTab: string;

  todayStarted = false;
  todayEnded = false;

  private todos: Todo[];
  private projects: Project[];

  private drapGroup: string;
  private createdTodo = new Subject<boolean>();

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
      this.createdTodo.asObservable().pipe(
        startWith(true),
        switchMap(() => this.todoService.get7Days()),
        switchMap(todos => this.projectService.addProjectTitleToTodos(todos))
      ).subscribe(todos => {
        this.todos = todos.sort((a, b) => b.position > a.position ? 1 : -1);
        this.processTodos(this.activeTab, this.todos);
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
    this.processTodos(this.activeTab, this.todos);
  }
  onCreate() {
    this.router.navigate([ ROUTES.CREATE ], { relativeTo: this.route });
  }
  onCreated() {
    this.createdTodo.next(true);
  }
  onShowDetail(todo: Todo) {
    this.router.navigate([ todo.id ], { relativeTo: this.route });
  }
  onDragStart(dragIndex: number, group: string) {
    this.dragIndex = dragIndex;
    this.drapGroup = group;
  }
  onDrop(dropIndex: number, group: string) {
    // if (this.drapGroup === group && dropIndex !== this.dragIndex) {
    //   const dragged = this.activeTodoGroup[group][this.dragIndex];
    //   const dropped = this.activeTodoGroup[group][dropIndex];
    //   if (dragged && dropped && dragged.status === dropped.status &&
    //     dragged.status !== TodoStatus.Waiting && dropped.status !== TodoStatus.Waiting) {
    //       this.todoService.swap(dragged, dropped);
    //   }
    // }
    this.dragIndex = undefined;
    this.drapGroup = undefined;
  }
  /**
   * @todo cache value, not do calc in template, use pipe maybe?
   */
  calcExpectedTime(todos: Todo[]): number {
    return todos.filter(a => a.expectedTime !== 0 && a.status === TodoStatus.InProgress)
      .reduce((sum, a) => sum + a.expectedTime, 0);
  }

  private processTodos(activeTab: string, todos: Todo[]) {
    const todayEnd = endOfToday();
    const tomorrowEnd = endofTomorrow();
    const weekEnd = endOfThisWeek();
    let filtered: Todo[];
    if (activeTab === this.TODAY) {
      filtered = todos.filter(a => a.happenDate - todayEnd <= 0);
    } else if (activeTab === this.TOMORROW) {
      filtered = todos.filter(a => a.happenDate > todayEnd && a.happenDate <= tomorrowEnd);
    } else {
      filtered = todos.filter(a => a.happenDate > tomorrowEnd && a.happenDate <= weekEnd);
    }
    const activeTodos = filtered
      .filter(a => a.status === TodoStatus.InProgress || a.status === TodoStatus.Waiting)
      .sort((a, b) => sortTodo(a, b));
    this.noTimeActiveTodosCount = activeTodos.filter(a => a.expectedTime === 0).length;
    this.activeTodosExpectedTime = this.calcExpectedTime(activeTodos);
    this.activeTodoGroup = this.groupTodos(activeTodos);
    this.activeGroups = keys(this.activeTodoGroup);

    this.doneTodoGroup = this.groupTodos(
      filtered
      .filter(a => this.isDoneOnToday(a))
      .sort((a, b) => b.finishAt - a.finishAt)
    );
    this.doneGroups = keys(this.doneTodoGroup);
  }
  private groupTodos(todos: Todo[]): TodoGroup {
    return groupBy(a => a.projectTitle, todos);
  }
  private isDoneOnToday(todo: Todo): boolean {
    return (todo.status === TodoStatus.Done || todo.status === TodoStatus.WontDo) &&
      format(todo.finishAt, 'YYYYMMDD') === format(now(), 'YYYYMMDD');
  }
}
