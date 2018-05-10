import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
  loading = false;
  isLoading() {
    this.loading = true;
  }
  stopLoading() {
    this.loading = false;
  }
}
