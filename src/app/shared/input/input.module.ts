import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StylingModule } from '../styling/styling.module';
import { InputComponent } from './input/input.component';

@NgModule({
  imports: [
    CommonModule,
    StylingModule
  ],
  declarations: [InputComponent],
  exports: [
    CommonModule,

    InputComponent,
  ]
})
export class InputModule { }
