import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { Add0Pipe } from './add0.pipe';
import { DaysDiffPipe } from './days-diff.pipe';
import { MinuteFormatterPipe } from './minute-formatter.pipe';
import { MstDatePipe } from './mst-date.pipe';
import { OverduePipe } from './overdue.pipe';
import { ShortTextPipe } from './short-text.pipe';
import { TimeRangeTypePipe } from './time-range-type.pipe';
import { WeekPipe } from './week.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    Add0Pipe,
    MinuteFormatterPipe,
    OverduePipe,
    MstDatePipe,
    ShortTextPipe,
    WeekPipe,
    TimeRangeTypePipe,
    DaysDiffPipe
  ],
  exports: [
    Add0Pipe,
    MinuteFormatterPipe,
    OverduePipe,
    MstDatePipe,
    ShortTextPipe,
    WeekPipe,
    TimeRangeTypePipe,
    DaysDiffPipe
  ]
})
export class PipesModule { }
