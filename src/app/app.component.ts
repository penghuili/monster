import { Component, OnInit } from '@angular/core';

import { IconsService } from './core/services/icons.service';
import { ROUTES } from './static/routes';

const { version: appVersion } = require('../../package.json');

@Component({
  selector: 'monster-root',
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
