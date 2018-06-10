import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserSupportGuard } from '@app/core';
import { ROUTES } from '@app/static';

import { SettingsStorageComponent } from './settings-storage/settings-storage.component';
import { SettingsComponent } from './settings/settings.component';

const settingsRoutes: Routes = [
  {
    path: ROUTES.SETTINGS,
    canActivateChild: [BrowserSupportGuard],
    children: [
      {
        path: ROUTES.STORAGE,
        component: SettingsStorageComponent
      },
      {
        path: '', component: SettingsComponent, pathMatch: 'full'
      }
    ]
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
