import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { IconModule } from '../icon/icon.module';
import { InputModule } from '../input/input.module';
import { StylingModule } from '../styling/styling.module';
import { ListItemComponent } from './list-item/list-item.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    InputModule,
    StylingModule,
    FlexLayoutModule
  ],
  declarations: [
    ListItemComponent,
  ],
  exports: [
    ListItemComponent,
  ]
})
export class ListModule { }
