import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';

import { StylingModule } from '../styling/styling.module';
import { IconAddComponent } from './icon-add/icon-add.component';
import { IconCloseComponent } from './icon-close/icon-close.component';
import { IconDoneComponent } from './icon-done/icon-done.component';
import { IconComponent } from './icon/icon.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    StylingModule
  ],
  declarations: [
    IconCloseComponent,
    IconDoneComponent,
    IconAddComponent,
    IconComponent,
  ],
  exports: [
    CommonModule,

    IconComponent,
    IconAddComponent,
    IconCloseComponent,
    IconDoneComponent
  ]
})
export class IconModule { }
