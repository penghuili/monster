import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

@Injectable()
export class RouterService {

  constructor(private router: Router) { }

  getCurrentFullRoute() {
    return this.router.events.pipe(
      startWith(new NavigationEnd(111, this.router.url, this.router.url)),
      filter(e => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    );
  }

}
