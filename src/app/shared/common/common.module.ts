import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IconModule } from '../icon/icon.module';
import { InputModule } from '../input/input.module';
import { StructureModule } from '../structure/structure.module';
import { CopyTextComponent } from './copy-text/copy-text.component';
import { LinkComponent } from './link/link.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IconModule,
    InputModule,
    StructureModule
  ],
  declarations: [
    CopyTextComponent,
    LinkComponent,
  ],
  exports: [
    CopyTextComponent,
    LinkComponent
  ]
})
export class MonsterCommonModule { }
