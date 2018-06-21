import { Injectable } from '@angular/core';
import { Motivation } from '@app/model';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class MotivationService {
  constructor(
    private dbService: DbService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {}

  getMotivations(): Observable<Motivation[]> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().motivations.toArray()
    ).pipe(
      catchError(() => this.handleError('getMotivations fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  add(motivation: Motivation): Observable<any> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().motivations.add(motivation)
    ).pipe(
      catchError(() => this.handleError('add motivation fails.')),
    );
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
