import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MonsterCommonModule } from '../common/common.module';
import { IconModule } from '../icon/icon.module';
import { OverlayModule } from '../overlay/overlay.module';
import { PipesModule } from '../pipes/pipes.module';
import { SliderModule } from '../slider/slider.module';
import { StylingModule } from '../styling/styling.module';
import { DurationPickerComponent } from './duration-picker/duration-picker.component';

@NgModule({
  imports: [
    CommonModule,
    SliderModule,
    FlexLayoutModule,
    StylingModule,
    IconModule,
    MonsterCommonModule,
    OverlayModule,
    PipesModule
  ],
  declarations: [DurationPickerComponent],
  exports: [
    DurationPickerComponent
  ]
})
export class DurationPickerModule { }
