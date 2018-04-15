import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MonsterCommonModule } from '../common/common.module';
import { IconModule } from '../icon/icon.module';
import { SliderModule } from '../slider/slider.module';
import { StylingModule } from '../styling/styling.module';
import { DaysHoursPickerComponent } from './days-hours-picker/days-hours-picker.component';

@NgModule({
  imports: [
    CommonModule,
    SliderModule,
    FlexLayoutModule,
    StylingModule,
    IconModule,
    MonsterCommonModule
  ],
  declarations: [DaysHoursPickerComponent],
  exports: [
    DaysHoursPickerComponent
  ]
})
export class DaysHoursPickerModule { }
