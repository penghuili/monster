import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule, DatepickerModule, PipesModule, StylingModule, WithinAppModule } from '@app/shared';

import { ReportStatsComponent } from './report-stats/report-stats.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    DatepickerModule,
    PipesModule,
    StylingModule,
    WithinAppModule,
    ButtonModule
  ],
  declarations: [ReportsComponent, ReportStatsComponent]
})
export class ReportsModule { }
