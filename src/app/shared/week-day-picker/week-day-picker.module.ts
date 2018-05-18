import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MonsterCommonModule } from '../common/common.module';
import { WeekDayPickerComponent } from './week-day-picker/week-day-picker.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WeekDayPickerComponent
  ],
  exports: [
    WeekDayPickerComponent
  ]
})
export class WeekDayPickerModule { }
