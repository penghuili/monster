import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '@app/core';
import { MonsterStorage, now, Todo, TodoStatus } from '@app/model';
import { ROUTES, Unsub } from '@app/static';
import { addDays, endOfDay } from 'date-fns';

@Component({
  selector: 'mst-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  activeTodos: Todo[];
  activeDoneTodos: Todo[];

  dragIndex: number;

  TODAY = 'today';
  IN3DAYS = '3days';
  IN7DAYS = '7days';
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
      this.todoService.getTodos().subscribe(todos => {
        this.todos = todos;
        this.updateActiveTodos(todos, this.activeTab);
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
    // this.todoService.updateInProgress(moveItem(this.dragIndex, dropIndex, this.todos));
  }

  private updateActiveTodos(todos: Todo[], activeTab: string) {
    const endOfToday = endOfDay(now()).getTime();
    const endof3Days = endOfDay(addDays(now(), 3)).getTime();
    const endOf7Days = endOfDay(addDays(now(), 7)).getTime();
    if (activeTab === this.TODAY) {
      const ts = todos.filter(a => a.happenDate - endOfToday <= 0);
      this.activeTodos = ts.filter(a => a.status === TodoStatus.InProgress);
      this.activeDoneTodos = ts.filter(a => a.status === TodoStatus.Done);
    } else if (activeTab === this.IN3DAYS) {
      const ts = todos.filter(a => a.happenDate > endOfToday && a.happenDate <= endof3Days);
      this.activeTodos = ts.filter(a => a.status === TodoStatus.InProgress);
      this.activeDoneTodos = ts.filter(a => a.status === TodoStatus.Done);
    } else if (activeTab === this.IN7DAYS) {
      const ts = todos.filter(a => a.happenDate > endof3Days && a.happenDate <= endOf7Days);
      this.activeTodos = ts.filter(a => a.status === TodoStatus.InProgress);
      this.activeDoneTodos = ts.filter(a => a.status === TodoStatus.Done);
    } else {
      this.activeTodos = [];
      this.activeDoneTodos = [];
    }
  }
}
