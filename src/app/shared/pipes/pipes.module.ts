import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Add0Pipe } from './add0.pipe';
import { MinuteFormatterPipe } from './minute-formatter.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [Add0Pipe, MinuteFormatterPipe],
  exports: [
    Add0Pipe,
    MinuteFormatterPipe
  ]
})
export class PipesModule { }
