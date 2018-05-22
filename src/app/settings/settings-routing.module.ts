import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { SettingsComponent } from './settings/settings.component';

const settingsRoutes: Routes = [
  {
    path: ROUTES.SETTINGS,
    component: SettingsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      settingsRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class SettingsRoutingModule {}
