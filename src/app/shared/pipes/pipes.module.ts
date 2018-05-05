import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Add0Pipe } from './add0.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [Add0Pipe],
  exports: [
    Add0Pipe
  ]
})
export class PipesModule { }
