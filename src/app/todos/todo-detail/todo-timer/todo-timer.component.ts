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
  label: string;
  totalTime: string;
  isDoing: boolean;

  private prevProgress: number;
  private sub: Subscription;

  ngOnChanges() {
    if (this.expectedTime && this.usedTime !== undefined) {
      this.expectedTime = this.expectedTime;
      this.usedTime = this.usedTime || 0;
      this.totalTime = this.parseMinute(this.expectedTime);
      this.label = this.parseSeconds(this.usedTime * 60);
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
      const seconds = this.expectedTime * 60;
      this.sub = interval(1000).subscribe(a => {
        this.progress = this.prevProgress + a / seconds;
        this.label = this.parseSeconds(a + this.usedTime * 60);
      });
    }
  }
  stop() {
    this.isDoing = false;
    this.sub.unsubscribe();
  }

  private parseMinute(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes - hours * 60;
    return `${add0(hours)}:${add0(mins)}`;
  }
  private parseSeconds(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds - hours * 3600) / 60);
    const secs = seconds - hours * 3600 - mins * 60;
    return hours > 0 ? `${add0(hours)}:${add0(mins)}:${add0(secs)}` : `${add0(mins)}:${add0(secs)}`;
  }
}
