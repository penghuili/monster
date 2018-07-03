import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'mst-sleeping',
  templateUrl: './sleeping.component.html',
  styleUrls: ['./sleeping.component.scss']
})
export class SleepingComponent implements OnInit {
  isShowSleeping: boolean;
  constructor() { }

  ngOnInit() {
    fromEvent(window, 'focus').pipe(
      startWith(true)
    ).subscribe(() => {
      this.isShowSleeping = this.shouldSleep();
    });
  }

  private shouldSleep(): boolean {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours === 22 && minutes >= 30) || hours > 22 || hours < 6;
  }

}
