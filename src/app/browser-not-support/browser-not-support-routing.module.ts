import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { BrowserNotSupportComponent } from './browser-not-support/browser-not-support.component';

const routes: Routes = [
  {
    path: ROUTES.NOT_SUPPORT,
    component: BrowserNotSupportComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      routes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class BrowserNotSupportRoutingModule {}
