import { Injectable } from '@angular/core';
import { EventType, MonsterEvents, now } from '@app/model';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

import { createSubproject, Subproject } from '../../model/project';
import { DbService } from './db.service';
import { EventService } from './event.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

@Injectable()
export class SubprojectService {

  constructor(
    private dbService: DbService,
    private eventService: EventService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {
  }

  getSubprojects(projectId?: number): Observable<Subproject[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().subprojects
        .filter(x => projectId ? x.projectId === projectId : true)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getSubprojects fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getSubprojectById(subid: number): Observable<Subproject> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().subprojects
         .where('id')
         .equals(subid)
        .first()
    ).pipe(
      catchError(error => this.handleError('getSubprojectById fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  getSubprojectsByIds(ids: number[]): Observable<Subproject[]> {
    this.loadingService.isLoading();
    return fromPromise(
      this.dbService.getDB().subprojects
        .where('id')
        .anyOf(ids)
        .toArray()
    ).pipe(
      catchError(error => this.handleError('getSubprojectsByIds fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  addSubproject(data: any): Observable<any> {
    this.loadingService.isLoading();
    const sp = createSubproject(data);
    return fromPromise(
      this.dbService.getDB().subprojects.add(sp)
    ).pipe(
      tap(id => {
        this.eventService.add({
          createdAt: now(),
          refId: id,
          type: EventType.Subproject,
          action: MonsterEvents.CreateSubproject
        });
      })
    ).pipe(
      catchError(error => this.handleError('addSubproject fails')),
      tap(() => {
        this.loadingService.stopLoading();
      })
    );
  }
  updateSubproject(subproject: Subproject) {
    this.loadingService.isLoading();
    fromPromise(
      this.dbService.getDB().subprojects.put(subproject)
    ).pipe(
      catchError(error => this.handleError('updateSubproject fails'))
    ).subscribe(() => {
      this.loadingService.stopLoading();
    });
  }
  updateSubprojects(subprojects: Subproject[]) {
    this.loadingService.isLoading();
    fromPromise(
      this.dbService.getDB().subprojects.bulkPut(subprojects)
    ).pipe(
      catchError(error => this.handleError('updateSubprojects fails'))
    ).subscribe(() => {
      this.loadingService.stopLoading();
    });
  }

  private handleError(message: string): Observable<any> {
    this.notificationService.sendMessage(message);
    return of(null);
  }
}
