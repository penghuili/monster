import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { ReportsComponent } from './reports/reports.component';

const reportsRoutes: Routes = [
  {
    path: ROUTES.REPORTS,
    component: ReportsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      reportsRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class ReportsRoutingModule {}
