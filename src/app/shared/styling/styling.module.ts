import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ColorDirective } from './color.directive';
import { CursorDirective } from './cursor.directive';
import { FontDirective } from './font.directive';
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
    PaddingDirective,
    ColorDirective,
    SizeDirective,
    TextAlignDirective,
    CursorDirective,
    FontDirective
  ],
  exports: [
    WrapperComponent,

    PaddingDirective,
    ColorDirective,
    SizeDirective,
    TextAlignDirective,
    CursorDirective,
    FontDirective
  ]
})
export class StylingModule { }
