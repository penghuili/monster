import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InputComponent } from './input/input.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [InputComponent],
  exports: [
    CommonModule,

    InputComponent,
  ]
})
export class InputModule { }
