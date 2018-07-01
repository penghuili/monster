import { Injectable } from '@angular/core';
import { Motivation, NowIWant } from '@app/model';
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

  getCurrentMotivation(): Observable<Motivation> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().motivations.toCollection().last()
    ).pipe(
      catchError(() => this.handleError('getCurrentMotivation fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getMotivations(): Observable<Motivation[]> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().motivations.reverse().toArray()
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

  getCurrentWant(): Observable<NowIWant> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().nowIWant.toCollection().last()
    ).pipe(
      catchError(() => this.handleError('getCurrentWant fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getWants(): Observable<NowIWant[]> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().nowIWant.reverse().toArray()
    ).pipe(
      catchError(() => this.handleError('getWants fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  addWant(want: NowIWant): Observable<any> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().nowIWant.add(want)
    ).pipe(
      catchError(() => this.handleError('addWant fails.')),
    );
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
