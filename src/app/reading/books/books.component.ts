import { Component, OnInit } from '@angular/core';
import { ReadingService } from '@app/core';
import { Book, isAfterToday, isBeforeToday, isWithin, now } from '@app/model';
import { Unsub } from '@app/static';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'mst-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent extends Unsub implements OnInit {
  activeBooks: Book[];
  somedayBooks: Book[];
  finishedBooks: Book[];
  overdueBooks: Book[];

  private books: Book[];
  private shouldLoad = new BehaviorSubject<boolean>(true);

  constructor(private readingService: ReadingService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.shouldLoad.asObservable().pipe(
        switchMap(() => this.readingService.getBooks())
      ).subscribe(books => {
        this.books = books || [];
        this.books = this.books.sort((a, b) => a.startDate - b.startDate);
        this.activeBooks = this.books.filter(a => !a.finished && isWithin(now(), a.startDate, a.endDate));
        this.somedayBooks = this.books.filter(a => !a.finished && isAfterToday(a.startDate));
        this.finishedBooks = this.books.filter(a => a.finished);
        this.overdueBooks = this.books.filter(a => !a.finished && isBeforeToday(a.endDate));
      })
    );
  }

  onCreated() {
    this.shouldLoad.next(true);
  }

}
