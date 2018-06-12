import { Injectable } from '@angular/core';
import {
  Book,
  BookItem,
  createBook,
  createBookItems,
  EventType,
  getStartEnd,
  isWithin,
  MonsterEvents,
  TimeRangeType,
  isBeforeDay,
} from '@app/model';
import { merge } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { EventService } from './event.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class ReadingService {
  constructor(
    private dbService: DbService,
    private eventService: EventService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {}

  getBooks(): Observable<Book[]> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().books.toArray()
    ).pipe(
      catchError(error => this.handleError('getBooks fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getBookById(id: number): Observable<Book> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().books
        .where('id')
        .equals(id)
        .first()
    ).pipe(
      catchError(error => this.handleError('getBookById fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getBookItems(date: number, mode: TimeRangeType): Observable<BookItem[]> {
    this.loadingService.isLoading();
    const [start, end] = getStartEnd(date, mode);

    return fromPromise(
      this.dbService.getDB().bookItems
        .filter(a => isWithin(a.happenDate, start, end) || (isBeforeDay(a.happenDate, start) && !a.finished))
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getBookItems fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getBookItemsByBookId(bookId: number): Observable<BookItem[]> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().bookItems
        .filter(a => a.bookId === bookId)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getBookItemsByBookId fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  add(data: any): Observable<any> {
    this.loadingService.isLoading();
    const book = createBook(data);
    const db = this.dbService.getDB();
    let bookId: number;
    const transaction = db.transaction('rw', db.books, db.bookItems, () => {
      return db.books.add(book)
        .then(id => {
          bookId = id;
          const bookWithId = merge(book, {id});
          const items = createBookItems(bookWithId);
          return db.bookItems.bulkAdd(items);
        });
    });
    return fromPromise(transaction).pipe(
      catchError(error => this.handleError('add book fails.')),
      tap(success => {
        this.loadingService.stopLoading();
        if (success) {
          this.eventService.add({
            refId: bookId,
            type: EventType.Book,
            action: MonsterEvents.CreateBook
          }).subscribe();
        }
      })
    );
  }
  update(book: Book): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().books.put(book)).pipe(
      map(() => true),
      catchError(error => this.handleError('update book fails')),
      tap(success => {
        this.loadingService.stopLoading();
      })
    );
  }
  updateBookItem(bookItem: BookItem): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().bookItems.put(bookItem)).pipe(
      map(success => true),
      catchError(error => this.handleError('update book fails')),
      tap(success => {
        this.loadingService.stopLoading();
        if (success && bookItem.finished) {
          this.getBookItemsByBookId(bookItem.bookId).pipe(
            filter(items => items && items.every(a => a.finished)),
            switchMap(() => this.getBookById(bookItem.bookId)),
            filter(book => !!book),
            switchMap(book => this.update(merge(book, {finished: true})))
          ).subscribe();
        }
      })
    );
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
