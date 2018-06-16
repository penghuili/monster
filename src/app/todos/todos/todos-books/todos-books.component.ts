import { Component, OnInit } from '@angular/core';
import { ReadingService, TodoService } from '@app/core';
import { BookItem, isBeforeToday, now, OVERDUE, TimeRangeType, TODAY } from '@app/model';
import { Unsub } from '@app/static';
import { isToday } from 'date-fns';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'mst-todos-books',
  templateUrl: './todos-books.component.html',
  styleUrls: ['./todos-books.component.scss']
})
export class TodosBooksComponent extends Unsub implements OnInit {
  activeBookItems: BookItem[];

  constructor(
    private readingService: ReadingService,
    private todoService: TodoService) {
      super();
  }

  ngOnInit() {
    this.addSubscription(
      combineLatest(
        this.readingService.getBookItems(now(), TimeRangeType.Day),
        this.todoService.getActiveTab()
      ).pipe(
        filter(([books, tab]) => !!books && !!tab)
      )
      .subscribe(([books, tab]) => {
        this.getActiveBookItems(tab, books);
      })
    );
  }

  private getActiveBookItems(tab: string, bookItems: BookItem[]) {
    const items = bookItems || [];
    if (tab === TODAY) {
      this.activeBookItems = items.filter(a => isToday(a.happenDate));
    } else if (tab === OVERDUE) {
      this.activeBookItems = items.filter(a => isBeforeToday(a.happenDate));
    } else {
      this.activeBookItems = [];
    }
  }

}
