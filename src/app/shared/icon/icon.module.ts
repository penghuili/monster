import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';

import { StylingModule } from '../styling/styling.module';
import { IconComponent } from './icon/icon.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    StylingModule
  ],
  declarations: [
    IconComponent,
  ],
  exports: [
    CommonModule,

    IconComponent
  ]
})
export class IconModule { }
