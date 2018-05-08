import { Component, OnInit } from '@angular/core';
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

  constructor() {
    this.appVersion = appVersion;
  }
}
