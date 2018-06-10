import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageApiService } from '@app/core';
import { ROUTES } from '@app/static';

@Component({
  selector: 'mst-browser-not-support',
  templateUrl: './browser-not-support.component.html',
  styleUrls: ['./browser-not-support.component.scss']
})
export class BrowserNotSupportComponent implements OnInit {
  isOldBrowser = false;
  isPrivateMode = false;

  constructor(
    private router: Router,
    private storageApiService: StorageApiService) { }

  ngOnInit() {
    this.isOldBrowser = !this.storageApiService.isDBSupported();
    this.isPrivateMode = this.storageApiService.isPrivateMode();

    if (!this.isOldBrowser && !this.isPrivateMode) {
      this.router.navigateByUrl(`/${ROUTES.TODOS}`);
    }
  }

}
