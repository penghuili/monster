import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MonsterCommonModule } from '../common/common.module';
import { IconModule } from '../icon/icon.module';
import { StructureModule } from '../structure/structure.module';
import { DatepickerMonthRowComponent } from './datepicker/datepicker-month-row/datepicker-month-row.component';
import { DatepickerMonthComponent } from './datepicker/datepicker-month/datepicker-month.component';
import { DatepickerTitleComponent } from './datepicker/datepicker-title/datepicker-title.component';
import { DatepickerYearListComponent } from './datepicker/datepicker-year-list/datepicker-year-list.component';
import { DatepickerComponent } from './datepicker/datepicker.component';

@NgModule({
  imports: [
    CommonModule,
    StructureModule,
    IconModule,
    MonsterCommonModule
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
