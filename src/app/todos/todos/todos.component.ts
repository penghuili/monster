import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '@app/core';
import { MonsterStorage, now, Todo, TodoStatus } from '@app/model';
import { INBOX, ROUTES, Unsub } from '@app/static';
import { addDays, endOfDay } from 'date-fns';

@Component({
  selector: 'mst-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  activeTodos: Todo[];
  doneTodos: Todo[];

  dragIndex: number;

  TODAY = 'today';
  IN3DAYS = '3days';
  IN7DAYS = '7days';
  INBOX = 'inbox';
  activeTab: string;

  private todos: Todo[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService) {
    super();
  }

  ngOnInit() {
    this.activeTab = MonsterStorage.get('activeTab') || this.TODAY;
    this.addSubscription(
      this.todoService.get7Days().subscribe(todos => {
        this.todos = todos.sort((a, b) => b.position > a.position ? 1 : -1);
        this.updateActiveTodos(this.todos, this.activeTab);
      })
    );
  }

  onChangeTab(tab: string) {
    MonsterStorage.set('activeTab', tab);
    this.activeTab = tab;
    this.updateActiveTodos(this.todos, this.activeTab);
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
    if (dropIndex !== this.dragIndex) {
      const dragged = this.activeTodos[this.dragIndex];
      const dropped = this.activeTodos[dropIndex];
      this.todoService.swap(dragged, dropped);
    }
  }

  private updateActiveTodos(todos: Todo[], activeTab: string) {
    const endOfToday = endOfDay(now()).getTime();
    const endof3Days = endOfDay(addDays(now(), 3)).getTime();
    const endOf7Days = endOfDay(addDays(now(), 7)).getTime();
    let filtered: Todo[];
    if (activeTab === this.TODAY) {
      filtered = todos.filter(a => a.projectId !== INBOX.id && a.happenDate - endOfToday <= 0);
    } else if (activeTab === this.IN3DAYS) {
      filtered = todos.filter(a => a.projectId !== INBOX.id && a.happenDate > endOfToday && a.happenDate <= endof3Days);
    } else if (activeTab === this.IN7DAYS) {
      filtered = todos.filter(a => a.projectId !== INBOX.id && a.happenDate > endof3Days && a.happenDate <= endOf7Days);
    } else {
      filtered = todos.filter(a => a.projectId === INBOX.id);
    }
    this.activeTodos = filtered.filter(a => a.status === TodoStatus.InProgress);
    this.doneTodos = filtered.filter(a => a.status === TodoStatus.Done).sort((a, b) => b.finishAt - a.finishAt);
  }
}
