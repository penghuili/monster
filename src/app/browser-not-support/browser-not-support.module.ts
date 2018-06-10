import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BrowserNotSupportRoutingModule } from './browser-not-support-routing.module';
import { BrowserNotSupportComponent } from './browser-not-support/browser-not-support.component';

@NgModule({
  imports: [
    CommonModule,

    BrowserNotSupportRoutingModule
  ],
  declarations: [BrowserNotSupportComponent]
})
export class BrowserNotSupportModule { }
