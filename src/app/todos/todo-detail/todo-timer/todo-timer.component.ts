import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { add0, now } from '@app/model';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { interval } from 'rxjs/observable/interval';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mst-todo-timer',
  templateUrl: './todo-timer.component.html',
  styleUrls: ['./todo-timer.component.scss']
})
export class TodoTimerComponent implements OnChanges, OnInit {
  @Input() expectedTime: number;
  @Input() usedTime: number;

  progress = 0;
  label: string;
  totalTime: string;
  isDoing: boolean;

  private prevProgress: number;
  private sub: Subscription;
  private startTime: number;

  ngOnInit() {
    fromEvent(window, 'focus').pipe(
      filter(() => this.isDoing)
    ).subscribe(() => {
      this.start();
    });
  }
  ngOnChanges() {
    if (this.expectedTime && this.usedTime !== undefined) {
      this.expectedTime = this.expectedTime;
      this.usedTime = this.usedTime || 0;
      this.totalTime = this.parseSeconds(this.expectedTime);
      this.label = this.parseSeconds(this.usedTime);
      this.prevProgress = this.usedTime / this.expectedTime;
      this.progress = this.prevProgress;
    }
  }

  start() {
    if (this.expectedTime) {
      this.isDoing = true;
      if (this.sub) {
        this.sub.unsubscribe();
      }
      let inActiveTime: number;
      const timestamp = now();
      if (!this.startTime) {
        inActiveTime = 0;
        this.startTime = timestamp;
      } else {
        inActiveTime = Math.round((timestamp - this.startTime) / 1000);
        this.startTime = timestamp;
      }
      this.sub = interval(1000).subscribe(a => {
        this.progress = this.prevProgress + (a + inActiveTime) / this.expectedTime;
        this.label = this.parseSeconds(a + inActiveTime + this.usedTime);
      });
    }
  }
  stop() {
    this.isDoing = false;
    this.startTime = undefined;
    this.sub.unsubscribe();
  }

  private parseSeconds(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds - hours * 3600) / 60);
    const secs = seconds - hours * 3600 - mins * 60;
    return `${add0(hours)}:${add0(mins)}:${add0(secs)}`;
  }
}
