import { Component } from '@angular/core';
import { DbService } from '@app/core';
import { ROUTES } from '@app/static';

const { version: appVersion } = require('../../../../package.json');

@Component({
  selector: 'mst-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  routes = ROUTES;
  appVersion: string;

  processDB = true;

  constructor(private dbService: DbService) {
    this.appVersion = appVersion;
  }

  process() {
    this.dbService.process();
  }
}
