import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconModule } from '../icon/icon.module';
import { StylingModule } from '../styling/styling.module';
import { TimelineItemComponent } from './timeline-item/timeline-item.component';

@NgModule({
  imports: [
    CommonModule,
    StylingModule,
    IconModule
  ],
  declarations: [TimelineItemComponent],
  exports: [
    TimelineItemComponent
  ]
})
export class TimelineModule { }
