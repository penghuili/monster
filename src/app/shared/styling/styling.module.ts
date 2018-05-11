import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BorderDirective } from './border.directive';
import { ColorDirective } from './color.directive';
import { CursorDirective } from './cursor.directive';
import { FontWeightDirective } from './font-weight.directive';
import { FontDirective } from './font.directive';
import { LineHeightDirective } from './line-height.directive';
import { NoSelectDirective } from './no-select.directive';
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
    FontDirective,
    NoSelectDirective,
    BorderDirective,
    LineHeightDirective,
    FontWeightDirective
  ],
  exports: [
    WrapperComponent,

    PaddingDirective,
    ColorDirective,
    SizeDirective,
    TextAlignDirective,
    CursorDirective,
    FontDirective,
    NoSelectDirective,
    BorderDirective,
    LineHeightDirective,
    FontWeightDirective
  ]
})
export class StylingModule { }
