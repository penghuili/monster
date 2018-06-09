import { Component, OnInit } from '@angular/core';
import { ROUTES, Unsub } from '@app/static';

import { AppHeaderService } from '../../services/app-header.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'mst-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent extends Unsub implements OnInit {
  titleData: any;
  isTodos: boolean;

  isSearching: boolean;

  constructor(
    private appHeaderService: AppHeaderService,
    private routerService: RouterService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.routerService.getCurrentFullRoute().subscribe(url => {
        this.isTodos = url === `/${ROUTES.TODOS}`;
      })
    );

    this.addSubscription(
      this.appHeaderService.getData().subscribe(data => {
        this.titleData = data;
      })
    );
  }

  onToggleSearch() {
    if (this.isSearching) {
      this.appHeaderService.hideSearch();
    } else {
      this.appHeaderService.showSearch();
    }
    this.isSearching = !this.isSearching;
  }
  showSearch() {
    return this.isTodos;
  }
}
