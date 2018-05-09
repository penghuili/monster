import { Component, Input, OnInit } from '@angular/core';
import { add0, Todo } from '@app/model';
import { interval ,  Subscription } from 'rxjs';

@Component({
  selector: 'mst-todo-timer',
  templateUrl: './todo-timer.component.html',
  styleUrls: ['./todo-timer.component.scss']
})
export class TodoTimerComponent {
  @Input() set todo(value: Todo) {
    if (value && (!this._todo || this._todo.expectedTime !== value.expectedTime)) {
      this._todo = value;
      this.totalTime = this.parseTime(this.todo.expectedTime);
      this.prevProgress = value.activities.reduce((sum, item) => sum + (item.endAt - item.startAt) / (1000 * 60), 0) / value.expectedTime;
      this.progress = this.prevProgress;
    }
  }
  get todo() {
    return this._todo;
  }

  progress = 0;
  totalTime: string;
  isDoing: boolean;

  private _todo: Todo;
  private prevProgress: number;
  private sub: Subscription;

  start() {
    if (this.todo && this.todo.expectedTime) {
      this.isDoing = true;
      if (this.sub) {
        this.sub.unsubscribe();
      }
      const seconds = this.todo.expectedTime * 60;
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
