import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, TodoService } from '@app/core';
import { isOverdue, MonsterStorage, now, Project, Todo, TodoGroup, TodoStatus } from '@app/model';
import { ROUTES, Unsub } from '@app/static';
import { addDays, endOfDay } from 'date-fns';
import { groupBy, keys } from 'ramda';
import { switchMap } from 'rxjs/operators';

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

  private todos: Todo[];
  private projects: Project[];

  private drapGroup: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    this.activeTab = MonsterStorage.get('activeTab') || this.TODAY;
    this.addSubscription(
      this.todoService.get7Days().pipe(
        switchMap(todos => this.projectService.addProjectTitleToTodos(todos))
      ).subscribe(todos => {
        this.todos = todos.sort((a, b) => b.position > a.position ? 1 : -1);
        this.processTodos(this.activeTab, this.todos);
      })
    );
  }

  onChangeTab(tab: string) {
    MonsterStorage.set('activeTab', tab);
    this.activeTab = tab;
    this.processTodos(this.activeTab, this.todos);
  }
  onCreate() {
    this.router.navigate([ ROUTES.CREATE ], { relativeTo: this.route });
  }
  onShowDetail(todo: Todo) {
    this.router.navigate([ todo.id ], { relativeTo: this.route });
  }
  onDragStart(dragIndex: number, group: string) {
    this.dragIndex = dragIndex;
    this.drapGroup = group;
  }
  onDrop(dropIndex: number, group: string) {
    if (this.drapGroup === group && dropIndex !== this.dragIndex) {
      const dragged = this.activeTodoGroup[group][this.dragIndex];
      const dropped = this.activeTodoGroup[group][dropIndex];
      if (dragged && dropped && dragged.status !== TodoStatus.Waiting && dropped.status !== TodoStatus.Waiting) {
        this.todoService.swap(dragged, dropped);
      }
    }
    this.dragIndex = undefined;
    this.drapGroup = undefined;
  }

  private processTodos(activeTab: string, todos: Todo[]) {
    const endOfToday = endOfDay(now()).getTime();
    const endofTomorrow = endOfDay(addDays(now(), 1)).getTime();
    const endOfThisWeek = endOfDay(addDays(now(), 7)).getTime();
    let filtered: Todo[];
    if (activeTab === this.TODAY) {
      filtered = todos.filter(a => a.happenDate - endOfToday <= 0);
    } else if (activeTab === this.TOMORROW) {
      filtered = todos.filter(a => a.happenDate > endOfToday && a.happenDate <= endofTomorrow);
    } else {
      filtered = todos.filter(a => a.happenDate > endofTomorrow && a.happenDate <= endOfThisWeek);
    }
    const activeTodos = filtered
      .filter(a => a.status !== TodoStatus.Done && a.status !== TodoStatus.WontDo)
      .sort((a, b) => this.sortActiveTodo(a, b));
    const len = activeTodos.length;
    const withTimeTodos = activeTodos.filter(a => a.expectedTime !== 0);
    this.noTimeActiveTodosCount = len - withTimeTodos.length;
    this.activeTodosExpectedTime = withTimeTodos.reduce((sum, a) => sum + a.expectedTime, 0);
    this.activeTodoGroup = this.groupTodos(activeTodos);
    this.activeGroups = keys(this.activeTodoGroup);
    this.doneTodoGroup = this.groupTodos(
      filtered
      .filter(a => a.status === TodoStatus.Done || a.status === TodoStatus.WontDo)
      .sort((a, b) => b.finishAt - a.finishAt)
    );
    this.doneGroups = keys(this.doneTodoGroup);
  }
  private groupTodos(todos: Todo[]): TodoGroup {
    return groupBy(a => a.projectTitle, todos);
  }
  private sortActiveTodo(a: Todo, b: Todo): number {
    return this.scoreTodoForOrder(b) - this.scoreTodoForOrder(a);
  }
  /**
   * @todo think more about this
   */
  private scoreTodoForOrder(todo: Todo): number {
    let score = 0;
    if (isOverdue(todo)) {
      score += 1;
    }
    if (todo.status === TodoStatus.InProgress) {
      score += 1;
    }
    return score;
  }
}
