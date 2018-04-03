import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OverlayComponent } from './overlay/overlay.component';
import { WrapperComponent } from './wrapper/wrapper.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WrapperComponent,
    OverlayComponent
  ],
  exports: [
    OverlayComponent,
    WrapperComponent
  ]
})
export class StructureModule { }
