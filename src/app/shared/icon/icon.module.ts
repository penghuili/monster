import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';

import { StructureModule } from '../structure/structure.module';
import { IconAddComponent } from './icon-add/icon-add.component';
import { IconCloseComponent } from './icon-close/icon-close.component';
import { IconDoneComponent } from './icon-done/icon-done.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    StructureModule
  ],
  declarations: [
    IconCloseComponent,
    IconDoneComponent,
    IconAddComponent,
  ],
  exports: [
    CommonModule,

    IconAddComponent,
    IconCloseComponent,
    IconDoneComponent
  ]
})
export class IconModule { }
