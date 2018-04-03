import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StructureModule } from '../structure/structure.module';
import { InputComponent } from './input/input.component';

@NgModule({
  imports: [
    CommonModule,
    StructureModule
  ],
  declarations: [InputComponent],
  exports: [
    CommonModule,

    InputComponent,
  ]
})
export class InputModule { }
