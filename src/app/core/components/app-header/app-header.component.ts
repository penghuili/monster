import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ROUTES, Unsub } from '@app/static';
import { filter, map, startWith } from 'rxjs/operators';

import { AppHeaderService } from '../../services/app-header.service';

@Component({
  selector: 'mst-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent extends Unsub implements OnInit {
  @Output() addTodo = new EventEmitter<boolean>();
  titleData: any;

  isTodos: boolean;

  constructor(
    private appHeaderService: AppHeaderService,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.router.events.pipe(
        startWith(new NavigationEnd(111, this.router.url, this.router.url)),
        filter(e => e instanceof NavigationEnd),
        map(e => e.urlAfterRedirects)
      ).subscribe(url => {
        this.isTodos = url === `/${ROUTES.TODOS}`;
      })
    );

    this.addSubscription(
      this.appHeaderService.getData().subscribe(data => {
        this.titleData = data;
      })
    );
  }

  onAddTodo() {
    this.addTodo.emit(true);
  }
}
