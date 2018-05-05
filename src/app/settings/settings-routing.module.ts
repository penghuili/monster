import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { ProcessDataComponent } from './process-data/process-data.component';
import { SettingsComponent } from './settings/settings.component';

const settingsRoutes: Routes = [
  {
    path: ROUTES.SETTINGS,
    component: SettingsComponent,
    children: [
      {
        path: ROUTES.PROCESS,
        component: ProcessDataComponent
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
