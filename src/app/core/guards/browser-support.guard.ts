import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

import { StorageApiService } from '../services/storage-api.service';

@Injectable()
export class BrowserSupportGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private storageApiService: StorageApiService) {}

  canActivate(): boolean {
    return this.check();
  }
  canActivateChild(): boolean {
    return this.check();
  }

  private check() {
    const supported = this.storageApiService.isDBSupported() && !this.storageApiService.isInPrivateMode();
    if (!supported) {
      this.router.navigateByUrl('sdfsd');
    }
    return supported;
  }
}
