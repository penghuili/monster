import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconModule } from '../icon/icon.module';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule
  ],
  declarations: [ProgressComponent],
  exports: [
    ProgressComponent
  ]
})
export class ProgressModule { }
