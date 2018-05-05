import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from '@app/core';
import { MonsterStorage, now, Todo } from '@app/model';
import { ROUTES, Unsub } from '@app/static';
import { addDays, endOfDay } from 'date-fns';

@Component({
  selector: 'mst-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent extends Unsub implements OnInit {
  activeTodos: Todo[];

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
        this.activeTodos = this.getActiveTodos(todos, this.activeTab);
      })
    );
  }

  onChangeTab(tab: string) {
    MonsterStorage.set('activeTab', tab);
    this.activeTab = tab;
    this.activeTodos = this.getActiveTodos(this.todos, this.activeTab);
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

  private getActiveTodos(todos: Todo[], activeTab: string): Todo[] {
    const endOfToday = endOfDay(now()).getTime();
    const endof3Days = endOfDay(addDays(now(), 3)).getTime();
    const endOf7Days = endOfDay(addDays(now(), 7)).getTime();
    if (activeTab === this.TODAY) {
      return todos.filter(a => a.happenDate - endOfToday <= 0);
    } else if (activeTab === this.IN3DAYS) {
      return todos.filter(a => a.happenDate > endOfToday && a.happenDate <= endof3Days);
    } else if (activeTab === this.IN7DAYS) {
      return todos.filter(a => a.happenDate > endof3Days && a.happenDate <= endOf7Days);
    } else {
      return [];
    }
  }
}
