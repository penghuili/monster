import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ButtonModule,
  DatepickerModule,
  InputModule,
  MonsterCommonModule,
  OverlayModule,
  PipesModule,
  StylingModule,
  TimelineModule,
} from '@app/shared';

import { RecordItemComponent } from './record-item/record-item.component';
import { RecordsRoutingModule } from './records-routing.module';
import { RecordsComponent } from './records/records.component';

@NgModule({
  imports: [
    CommonModule,
    RecordsRoutingModule,
    TimelineModule,
    StylingModule,
    PipesModule,
    DatepickerModule,
    ButtonModule,
    OverlayModule,
    InputModule,
    MonsterCommonModule
  ],
  declarations: [RecordsComponent, RecordItemComponent]
})
export class RecordsModule { }
