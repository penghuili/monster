import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Todo } from '@app/model';
import { InputControl } from '@app/shared';
import { ROUTES, Unsub } from '@app/static';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'mst-search-todos',
  templateUrl: './search-todos.component.html',
  styleUrls: ['./search-todos.component.scss']
})
export class SearchTodosComponent extends Unsub implements OnInit {
  @Input() todos: Todo[];
  results: Todo[];
  searchControl = new InputControl();

  constructor(private router: Router) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.searchControl.value$.pipe(
        debounceTime(300),
        filter(text => !!text && !!text.trim())
      ).subscribe(text => {
        const todos = this.todos || [];
        this.results = todos.filter(a => a.title.indexOf(text) > -1);
      })
    );
  }

  onShowDetail(todo: Todo) {
    this.router.navigateByUrl(`${ROUTES.TODOS}/${todo.id}`);
  }
}
