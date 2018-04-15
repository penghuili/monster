import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MonsterCommonModule } from '../common/common.module';
import { IconModule } from '../icon/icon.module';
import { OverlayModule } from '../overlay/overlay.module';
import { StylingModule } from '../styling/styling.module';
import { DatepickerMonthRowComponent } from './datepicker/datepicker-month-row/datepicker-month-row.component';
import { DatepickerMonthComponent } from './datepicker/datepicker-month/datepicker-month.component';
import { DatepickerTitleComponent } from './datepicker/datepicker-title/datepicker-title.component';
import { DatepickerYearListComponent } from './datepicker/datepicker-year-list/datepicker-year-list.component';
import { DatepickerComponent } from './datepicker/datepicker.component';

@NgModule({
  imports: [
    CommonModule,
    StylingModule,
    IconModule,
    MonsterCommonModule,
    OverlayModule,
    FlexLayoutModule
  ],
  declarations: [
    DatepickerComponent,
    DatepickerTitleComponent,
    DatepickerYearListComponent,
    DatepickerMonthComponent,
    DatepickerMonthRowComponent
  ],
  exports: [
    DatepickerComponent
  ]
})
export class DatepickerModule { }
