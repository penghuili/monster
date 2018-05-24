import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { RecordsComponent } from './records/records.component';

const recordsRoutes: Routes = [
  {
    path: ROUTES.THOUGHTS,
    component: RecordsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      recordsRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class RecordsRoutingModule {}
