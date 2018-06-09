import { Component, OnInit } from '@angular/core';
import { ROUTES, Unsub } from '@app/static';
import { debounceTime } from 'rxjs/operators';

import { InputService } from '../../services/input.service';

@Component({
  selector: 'mst-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent extends Unsub implements OnInit {
  hideNavigation = false;
  routes = ROUTES;

  constructor(private inputService: InputService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.inputService.getFocusStatus().pipe(
        debounceTime(300)
      ).subscribe(focus => {
        this.hideNavigation = focus;
      })
    );
  }
}
