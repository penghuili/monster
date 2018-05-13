import { Component, Input, OnChanges } from '@angular/core';
import { add0, Todo } from '@app/model';
import { interval } from 'rxjs/observable/interval';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mst-todo-timer',
  templateUrl: './todo-timer.component.html',
  styleUrls: ['./todo-timer.component.scss']
})
export class TodoTimerComponent implements OnChanges {
  @Input() expectedTime: number;
  @Input() usedTime: number;

  progress = 0;
  totalTime: string;
  isDoing: boolean;

  private prevProgress: number;
  private sub: Subscription;

  ngOnChanges() {
    if (this.expectedTime) {
      this.expectedTime = this.expectedTime;
      this.usedTime = this.usedTime || 0;
      this.totalTime = this.parseTime(this.expectedTime);
      this.prevProgress = this.usedTime / (1000 * 60) / this.expectedTime;
      this.progress = this.prevProgress;
    }
  }

  start() {
    if (this.expectedTime) {
      this.isDoing = true;
      if (this.sub) {
        this.sub.unsubscribe();
      }
      const seconds = this.expectedTime * 60;
      this.sub = interval(1000).subscribe(a => {
        this.progress = this.prevProgress + a / seconds;
      });
    }
  }
  stop() {
    this.isDoing = false;
    this.sub.unsubscribe();
  }

  private parseTime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes - hours * 60;
    return `${add0(hours)}:${add0(mins)}`;
  }
}
