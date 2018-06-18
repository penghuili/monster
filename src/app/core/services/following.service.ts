import { Injectable } from '@angular/core';
import { EventType, Following, FollowingItem, MonsterEvents } from '@app/model';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { DbService } from './db.service';
import { EventService } from './event.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class FollowingService {
  constructor(
    private dbService: DbService,
    private eventService: EventService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {}

  getFollowings(): Observable<Following[]> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().followings.toArray()
    ).pipe(
      catchError(error => this.handleError('getFollowings fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getFollowingById(id: number): Observable<Following> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().followings
        .where('id')
        .equals(id)
        .first()
    ).pipe(
      catchError(error => this.handleError('getFollowingById fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getFollowingItemsByFollowingId(followingId: number): Observable<FollowingItem[]> {
    this.loadingService.isLoading();

    return fromPromise(
      this.dbService.getDB().followingItems
        .filter(a => a.followingId === followingId)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getFollowingItemsByFollowingId fails.')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  add(following: Following): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().followings.add(following)
    ).pipe(
      catchError(() => this.handleError('add following fails.')),
      tap(followingId => {
        this.loadingService.stopLoading();
        if (followingId) {
          this.eventService.add({
            refId: followingId,
            type: EventType.Following,
            action: MonsterEvents.CreateFollowing
          }).subscribe();
        }
      })
    );
  }
  update(following: Following): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().followings.put(following)).pipe(
      catchError(() => this.handleError('update book fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  addFollowingItem(followingItem: FollowingItem): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().followingItems.add(followingItem)
    ).pipe(
      catchError(() => this.handleError('add followingItem fails.')),
      tap(followingItemId => {
        this.loadingService.stopLoading();
        if (followingItemId) {
          this.eventService.add({
            refId: followingItemId,
            type: EventType.FollowingItem,
            action: MonsterEvents.CreateFollowingItem
          }).subscribe();
        }
      })
    );
  }
  updateFollowingItem(followingItem: FollowingItem): Observable<any> {
    this.loadingService.isLoading();
    return fromPromise(this.dbService.getDB().followingItems.put(followingItem)).pipe(
      catchError(() => this.handleError('update followingItem fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
