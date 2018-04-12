import { Component, OnInit } from '@angular/core';
import { ROUTES } from '@app/static';

@Component({
  selector: 'monster-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  routes = ROUTES;
}
