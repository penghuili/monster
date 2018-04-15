import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ColorDirective } from './color.directive';
import { OverlayComponent } from './overlay/overlay.component';
import { PaddingDirective } from './padding.directive';
import { SizeDirective } from './size.directive';
import { TextAlignDirective } from './text-align.directive';
import { WrapperComponent } from './wrapper/wrapper.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    WrapperComponent,
    OverlayComponent,
    PaddingDirective,
    ColorDirective,
    SizeDirective,
    TextAlignDirective
  ],
  exports: [
    OverlayComponent,
    WrapperComponent,

    PaddingDirective,
    ColorDirective,
    SizeDirective,
    TextAlignDirective
  ]
})
export class StylingModule { }
