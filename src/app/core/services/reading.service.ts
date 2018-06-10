import { Injectable } from '@angular/core';
import { Book, createBook, EventType, MonsterEvents } from '@app/model';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

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
  add(data: any): Observable<any> {
    this.loadingService.isLoading();
    const book = createBook(data);
    return fromPromise(
      this.dbService.getDB().books.add(book)
    ).pipe(
      catchError(error => this.handleError('add book fails.')),
      tap(id => {
        this.loadingService.stopLoading();
        if (id) {
          this.eventService.add({
            refId: id,
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

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
