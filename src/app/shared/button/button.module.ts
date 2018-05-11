import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { IconModule } from '../icon/icon.module';
import { StylingModule } from '../styling/styling.module';
import { ActionButtonComponent } from './action-button/action-button.component';
import { GoBackComponent } from './go-back/go-back.component';
import { TabComponent } from './tab/tab.component';

@NgModule({
  imports: [
    CommonModule,
    StylingModule,
    IconModule,
    FlexLayoutModule
  ],
  declarations: [ActionButtonComponent, GoBackComponent, TabComponent],
  exports: [
    ActionButtonComponent,
    GoBackComponent,
    TabComponent
  ]
})
export class ButtonModule { }
