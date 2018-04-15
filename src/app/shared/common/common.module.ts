import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IconModule } from '../icon/icon.module';
import { InputModule } from '../input/input.module';
import { StylingModule } from '../styling/styling.module';
import { CancelConfirmComponent } from './cancel-confirm/cancel-confirm.component';
import { CopyTextComponent } from './copy-text/copy-text.component';
import { LinkComponent } from './link/link.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IconModule,
    InputModule,
    StylingModule
  ],
  declarations: [
    CopyTextComponent,
    LinkComponent,
    CancelConfirmComponent,
  ],
  exports: [
    CopyTextComponent,
    LinkComponent,
    CancelConfirmComponent
  ]
})
export class MonsterCommonModule { }
