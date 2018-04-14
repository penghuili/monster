import { Component, OnInit } from '@angular/core';
import { IconsService } from '@app/core';
import { ROUTES } from '@app/static';

const { version: appVersion } = require('../../package.json');

@Component({
  selector: 'mst-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  appVersion: string;
  routes = ROUTES;

  constructor(private iconsService: IconsService) {
  }

  ngOnInit() {
    this.appVersion = appVersion;
    this.iconsService.init();
  }
}
