import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

export class Unsub implements OnDestroy {
  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(s => {
      if (s) {
        s.unsubscribe();
      }
    });
  }

  addSubscription(s: Subscription) {
    this.subscriptions.push(s);
  }
}
