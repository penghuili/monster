import { Component, Input, OnInit } from '@angular/core';
import { add0, Todo } from '@app/model';
import { Unsub } from '@app/static';
import { interval } from 'rxjs/observable/interval';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mst-todo-timer',
  templateUrl: './todo-timer.component.html',
  styleUrls: ['./todo-timer.component.scss']
})
export class TodoTimerComponent extends Unsub implements OnInit {
  @Input() todo: Todo;

  time: string;
  isNegative = false;

  private sub: Subscription;

  ngOnInit() {
  }

  start() {
    if (this.todo && this.todo.expectedTime) {
      const time = this.todo.expectedTime * 60 * 60;
      this.sub = interval(1000).pipe(
        map(a => time - a)
      ).subscribe(a => {
        this.isNegative = a < 0;
        this.time = this.parseSeconds(Math.abs(a));
      });
    }
  }
  stop() {
    this.sub.unsubscribe();
  }

  private parseSeconds(sec: number) {
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec - hours * 3600) / 60);
    const secs = Math.floor(sec - hours * 3600 - mins * 60);
    let formated = '';
    if (hours > 0) {
      formated += `${hours}:`;
    }
    if (hours > 0 || mins > 0) {
      formated += `${add0(mins)}:`;
    }
    formated += `${add0(secs)}`;
    return formated;
  }
}
