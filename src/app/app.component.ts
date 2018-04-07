import { Component, OnInit } from '@angular/core';

import { IconsService } from './core/services/icons.service';

const { version: appVersion } = require('../../package.json');

@Component({
  selector: 'monster-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  appVersion: string;
  constructor(private iconsService: IconsService) {
  }

  ngOnInit() {
    this.appVersion = appVersion;
    this.iconsService.init();
  }
}
