import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Todo } from '@app/model';
import { InputControl } from '@app/shared';
import { ROUTES, Unsub } from '@app/static';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'mst-todos-search',
  templateUrl: './todos-search.component.html',
  styleUrls: ['./todos-search.component.scss']
})
export class TodosSearchComponent extends Unsub implements OnInit {
  @Input() todos: Todo[];
  results: Todo[];
  searchControl = new InputControl<string>();

  constructor(private router: Router) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.searchControl.value$.pipe(
        debounceTime(300),
        map(text => text ? text.trim() : '')
      ).subscribe(text => {
        if (text) {
          const todos = this.todos || [];
          this.results = todos.filter(a => a.title.toLowerCase().indexOf(text.toLowerCase()) > -1);
        } else {
          this.results = null;
        }
      })
    );
  }

  onShowDetail(todo: Todo) {
    this.router.navigateByUrl(`${ROUTES.TODOS}/${todo.id}`);
  }
}
