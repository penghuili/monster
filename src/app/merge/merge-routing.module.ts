import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { MergeStorageComponent } from './merge-storage/merge-storage.component';

const mergeRoutes: Routes = [
  {
    path: ROUTES.MERGE,
    component: MergeStorageComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      mergeRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class MergeRoutingModule {}
