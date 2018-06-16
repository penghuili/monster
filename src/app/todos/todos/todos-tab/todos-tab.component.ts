import { Component, Input, OnInit } from '@angular/core';
import { NotificationService, TodoService } from '@app/core';
import {
  calcExpectedTime,
  getActiveTab,
  hasTodos as hasTodosM,
  isTodayStarted,
  MonsterStorage,
  now,
  OVERDUE,
  ProjectWithTodos,
  redoneOverdueForToday,
  THISWEEK,
  TODAY,
  TodoStatus,
  TOMORROW,
} from '@app/model';
import { isToday } from 'date-fns';

@Component({
  selector: 'mst-todos-tab',
  templateUrl: './todos-tab.component.html',
  styleUrls: ['./todos-tab.component.scss']
})
export class TodosTabComponent implements OnInit {
  @Input() projectsWithTodos: ProjectWithTodos[];

  OVERDUE = OVERDUE;
  TODAY = TODAY;
  TOMORROW = TOMORROW;
  THISWEEK = THISWEEK;
  activeTab: string;

  todayStarted = false;

  constructor(
    private notificationService: NotificationService,
    private todoServive: TodoService) { }

  ngOnInit() {
    this.activeTab = getActiveTab();
    this.todayStarted = isTodayStarted();
  }

  showStartToday() {
    return !this.todayStarted && this.activeTab === this.TODAY;
  }
  showRedoOverdue() {
    return this.activeTab === this.OVERDUE && !redoneOverdueForToday();
  }
  hasTodos() {
    return this.projectsWithTodos && hasTodosM(this.projectsWithTodos);
  }
  onRedoOverdue() {
    MonsterStorage.set('redo-overdue-at', now());
  }
  onStartToday() {
    const todos = this.projectsWithTodos
      .map(p => p.todos)
      .reduce((sum, curr) => sum.concat(curr), []);

    const todaysTodos = todos.filter(a => isToday(a.happenDate) && a.status === TodoStatus.InProgress);
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
  onChangeTab(tab: string) {
    MonsterStorage.set('active-tab', tab);
    this.activeTab = tab;
    this.todoServive.setActiveTab(tab);
  }

}
