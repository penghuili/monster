import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SliderModule } from '../slider/slider.module';
import { DaysHoursPickerComponent } from './days-hours-picker/days-hours-picker.component';

@NgModule({
  imports: [
    CommonModule,
    SliderModule,
    FlexLayoutModule
  ],
  declarations: [DaysHoursPickerComponent],
  exports: [
    DaysHoursPickerComponent
  ]
})
export class DaysHoursPickerModule { }
