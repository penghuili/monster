import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { IconModule } from '../icon/icon.module';
import { OverlayModule } from '../overlay/overlay.module';
import { StylingModule } from '../styling/styling.module';
import { DragItemComponent } from './drag-item/drag-item.component';
import { DropZoneComponent } from './drop-zone/drop-zone.component';

@NgModule({
  imports: [
    CommonModule,
    StylingModule,
    FlexLayoutModule,
    // DndModule,
    IconModule,
    OverlayModule
  ],
  declarations: [
    DragItemComponent,
    DropZoneComponent,
  ],
  exports: [
    DragItemComponent,
    DropZoneComponent,
  ]
})
export class DragDropModule { }
