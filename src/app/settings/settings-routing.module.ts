import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { CopyStorageComponent } from './copy-storage/copy-storage.component';
import { MergeStorageComponent } from './merge-storage/merge-storage.component';
import { SettingsComponent } from './settings/settings.component';

const settingsRoutes: Routes = [
  {
    path: ROUTES.SETTINGS,
    component: SettingsComponent,
    children: [
      {
        path: ROUTES.MERGE,
        component: MergeStorageComponent
      },
      {
        path: ROUTES.COPY,
        component: CopyStorageComponent
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