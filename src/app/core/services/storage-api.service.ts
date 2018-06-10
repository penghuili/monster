import { Injectable } from '@angular/core';
import { EstimatedStorageUsage } from '@app/model';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class StorageApiService {

  constructor() { }

  isDBSupported(): boolean {
    return !!window.indexedDB;
  }
  isPrivateMode(): boolean {
    try {
      localStorage.setItem('mst-test-private-mode', 'test');
      localStorage.removeItem('mst-test-private-mode');
      return false;
    } catch (e) {
      return true;
    }
  }

  isStorageApiSupported(): boolean {
    return !!(<any>window.navigator).storage;
  }
  isPersisted(): Observable<boolean> {
    return fromPromise((<any>window.navigator).storage.persisted()).pipe(
      map(persisted => !!persisted),
      catchError(e => of(false))
    );
  }
  askForPersistStorage(): Observable<boolean> {
    return fromPromise((<any>window.navigator).storage.persist()).pipe(
      map(persist => !!persist),
      catchError(e => of(false))
    );
  }
  getEstimatedStorageUsage(): Observable<EstimatedStorageUsage> {
    return fromPromise((<any>window.navigator).storage.estimate()).pipe(
      map((data: any) => ({quota: data.quota, usage: data.usage})),
      catchError(e => of(null))
    );
  }
}
