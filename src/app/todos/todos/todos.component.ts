import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitService, NotificationService, ProjectService, TodoService } from '@app/core';
import {
  calcExpectedTime,
  Color,
  endOfThisWeek,
  endOfToday,
  endofTomorrow,
  Habit,
  isBeforeToday,
  isFinished,
  isOverDue,
  isTodayEnded,
  isTodayStarted,
  isWithinDay,
  MonsterStorage,
  now,
  ProjectStatus,
  ProjectWithTodos,
  sortTodos,
  Todo,
  TodoStatus,
} from '@app/model';
import { ROUTES, Unsub } from '@app/static';
import { isToday, isTomorrow } from 'date-fns';
import { merge } from 'ramda';
import { startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  todos: Todo[];
  activeTodos: Todo[];
  activeProjectsWithTodos: ProjectWithTodos[];
  doneProjectsWithTodos: ProjectWithTodos[];

  dragIndex: number;

  OVERDUE = 'overdue';
  TODAY = 'today';
  TOMORROW = 'tomorrow';
  THISWEEK = 'this week';
  NEXTWEEK = 'next week';
  activeTab: string;

  todayStarted = false;
  todayEnded = false;

  habits: Habit[];

  showSearch = false;

  Color = Color;

  private projectsWithTodos: ProjectWithTodos[];
  private drapProjectId: number;
  private shouldReload = new Subject<boolean>();

  constructor(
    private habitService: HabitService,
    private notificationService: NotificationService,
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
          this.todos = todos || [];
          return this.projectService.getProjectsWithTodos(todos);
        })
      ).subscribe(projectsWithTodos => {
        this.projectsWithTodos = (projectsWithTodos || [])
          .filter(a => a.project.status !== ProjectStatus.Done);
        this.process(this.activeTab, this.projectsWithTodos, this.todos);
      })
    );

    this.addSubscription(
      this.habitService.getTodaysHabits().subscribe(habits => {
        this.habits = habits;
      })
    );
  }

  isStartTodayEnabled() {
    return !this.todayStarted && this.activeTab === this.TODAY;
  }
  onToggleSearch() {
    this.showSearch = !this.showSearch;
  }
  onStartToday() {
    if (this.activeTab === this.TODAY) {
      const todaysTodos = this.activeTodos.filter(a => isToday(a.happenDate) && a.status === TodoStatus.InProgress);
      const canStart = calcExpectedTime(todaysTodos) <= 7 * 60;
      if (canStart) {
        const want = confirm('are you sure to start today now?');
        if (want) {
          if (!this.todayStarted) {
            this.todayStarted = true;
            MonsterStorage.set('start-today', now());
          }
        }
      } else {
        this.notificationService.sendMessage(`there will be more than 7 hours on this day, you can't start today.`);
      }
    }
  }
  onChangeTab(tab: string) {
    MonsterStorage.set('activeTab', tab);
    this.activeTab = tab;

    this.process(this.activeTab, this.projectsWithTodos, this.todos);
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
  onShowHabitDetail(habit: Habit) {
    this.router.navigateByUrl(`${ROUTES.PLANS}/${ROUTES.HABITS}/${habit.id}`);
  }

  private process(activeTab: string, projectsWithTodos: ProjectWithTodos[], todos: Todo[]) {
    this.processTodos(activeTab, projectsWithTodos);
    this.calcTotal(activeTab, todos);
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
  private processTodos(activeTab: string, projectsWithTodos: ProjectWithTodos[]) {
    const tomorrowEnd = endofTomorrow();
    const weekEnd = endOfThisWeek();
    let filteredActive: ProjectWithTodos[];
    let activeFilterFunction: (a: Todo) => boolean;
    if (activeTab === this.OVERDUE) {
      activeFilterFunction = a => isBeforeToday(a.happenDate);
    } else if (activeTab === this.TODAY) {
      activeFilterFunction = a => isToday(a.happenDate);
    } else if (activeTab === this.TOMORROW) {
      activeFilterFunction = a => isTomorrow(a.happenDate);
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
  }
  private calcTotal(activeTab: string, todos: Todo[]) {
    const todayEnd = endOfToday();
    const tomorrowEnd = endofTomorrow();
    const weekEnd = endOfThisWeek();
    let filtered: Todo[];
    if (activeTab === this.OVERDUE) {
      filtered = todos.filter(a => isBeforeToday(a.happenDate));
    } else if (activeTab === this.TODAY) {
      filtered = todos.filter(a => isToday(a.happenDate));
    } else if (activeTab === this.TOMORROW) {
      filtered = todos.filter(a => isTomorrow(a.happenDate));
    } else if (activeTab === this.THISWEEK) {
      filtered = todos.filter(a => a.happenDate > tomorrowEnd && a.happenDate <= weekEnd);
    } else {
      filtered = todos.filter(a => a.happenDate > weekEnd);
    }

    this.activeTodos = filtered.filter(a => a.status === TodoStatus.InProgress);
  }
  private isDoneOnToday(todo: Todo): boolean {
    return isFinished(todo) && isWithinDay(todo.finishAt, now());
  }
}
