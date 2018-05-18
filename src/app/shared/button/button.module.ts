import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { IconModule } from '../icon/icon.module';
import { StylingModule } from '../styling/styling.module';
import { ActionButtonComponent } from './action-button/action-button.component';
import { GoBackComponent } from './go-back/go-back.component';
import { PageTopBottomButtonComponent } from './page-top-bottom-button/page-top-bottom-button.component';
import { TabComponent } from './tab/tab.component';

@NgModule({
  imports: [
    CommonModule,
    StylingModule,
    IconModule,
    FlexLayoutModule
  ],
  declarations: [
    ActionButtonComponent,
    GoBackComponent,
    TabComponent,
    PageTopBottomButtonComponent
  ],
  exports: [
    ActionButtonComponent,
    GoBackComponent,
    TabComponent,
    PageTopBottomButtonComponent
  ]
})
export class ButtonModule { }
