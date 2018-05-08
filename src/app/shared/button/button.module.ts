import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconModule } from '../icon/icon.module';
import { StylingModule } from '../styling/styling.module';
import { ActionButtonComponent } from './action-button/action-button.component';
import { GoBackComponent } from './go-back/go-back.component';

@NgModule({
  imports: [
    CommonModule,
    StylingModule,
    IconModule
  ],
  declarations: [ActionButtonComponent, GoBackComponent],
  exports: [
    ActionButtonComponent,
    GoBackComponent
  ]
})
export class ButtonModule { }
