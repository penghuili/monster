import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DatepickerModule } from '@app/shared';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    DatepickerModule
  ],
  declarations: [ReportsComponent]
})
export class ReportsModule { }
