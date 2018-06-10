import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserSupportGuard } from '@app/core';
import { ROUTES } from '@app/static';

import { ReportsComponent } from './reports/reports.component';

const reportsRoutes: Routes = [
  {
    path: ROUTES.REPORTS,
    canActivate: [BrowserSupportGuard],
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
