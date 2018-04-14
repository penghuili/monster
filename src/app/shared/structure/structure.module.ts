import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OverlayComponent } from './overlay/overlay.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { PaddingDirective } from './padding.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WrapperComponent,
    OverlayComponent,
    PaddingDirective
  ],
  exports: [
    OverlayComponent,
    WrapperComponent
  ]
})
export class StructureModule { }
