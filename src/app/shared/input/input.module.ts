import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StylingModule } from '../styling/styling.module';
import { InputComponent } from './input/input.component';
import { SwitchComponent } from './switch/switch.component';

@NgModule({
  imports: [
    CommonModule,
    StylingModule
  ],
  declarations: [InputComponent, SwitchComponent],
  exports: [
    CommonModule,

    InputComponent,
    SwitchComponent
  ]
})
export class InputModule { }
