import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DndModule } from 'ngx-drag-drop';

import { IconModule } from '../icon/icon.module';
import { OverlayModule } from '../overlay/overlay.module';
import { StylingModule } from '../styling/styling.module';
import { DragDropItemComponent } from './drag-drop-list/drag-drop-item/drag-drop-item.component';
import { DragDropListComponent } from './drag-drop-list/drag-drop-list.component';

@NgModule({
  imports: [
    CommonModule,
    StylingModule,
    FlexLayoutModule,
    DndModule,
    IconModule,
    OverlayModule
  ],
  declarations: [
    DragDropListComponent,
    DragDropItemComponent
  ],
  exports: [
    DragDropListComponent,
    DragDropItemComponent
  ]
})
export class DragDropModule { }
