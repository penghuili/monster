import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconsService } from '@app/core';
import { MonsterStorage, now } from '@app/model';
import { ROUTES } from '@app/static';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { filter, startWith } from 'rxjs/operators';

@Component({
  selector: 'mst-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private iconsService: IconsService,
    private router: Router) {
  }

  ngOnInit() {
    this.iconsService.init();
    this.goToMotivationAfterAWhile();
  }

  private goToMotivationAfterAWhile() {
    fromEvent(window, 'focus').pipe(
      startWith(true),
      filter(() => {
        const lastActiveTime = MonsterStorage.get('mst-active-timestamp');
        return !lastActiveTime || now() - lastActiveTime >= 60 * 60 * 1000;
      })
    ).subscribe(() => {
      MonsterStorage.set('mst-active-timestamp', now());
      this.router.navigateByUrl(`${ROUTES.SETTINGS}/${ROUTES.MOTIVATION}`);
    });
  }
}
