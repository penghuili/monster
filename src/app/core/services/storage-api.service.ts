import { Injectable } from '@angular/core';

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
}
