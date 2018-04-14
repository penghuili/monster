import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SliderComponent } from './slider/slider.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SliderComponent],
  exports: [
    SliderComponent
  ]
})
export class SliderModule { }
