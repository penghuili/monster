import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES, Unsub } from '@app/static';

import { AppHeaderService } from '../../services/app-header.service';
import { MotivationService } from '../../services/motivation.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'mst-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent extends Unsub implements OnInit {
  titleData: any;
  want: string;
  isTodos: boolean;

  isSearching: boolean;

  constructor(
    private appHeaderService: AppHeaderService,
    private motivationService: MotivationService,
    private router: Router,
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

    this.addSubscription(
      this.motivationService.getCurrentWant().subscribe(w => {
        this.want = w ? w.want : '';
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
  goToMotivation() {
    this.router.navigateByUrl(`${ROUTES.SETTINGS}/${ROUTES.MOTIVATION}`);
  }
}
