import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WrapperComponent } from './wrapper/wrapper.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WrapperComponent
  ],
  exports: [
    WrapperComponent,
  ]
})
export class StructureModule { }
