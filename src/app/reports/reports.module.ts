import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ButtonModule,
  DatepickerModule,
  IconModule,
  InputModule,
  PipesModule,
  StylingModule,
  TimelineModule,
  WithinAppModule,
} from '@app/shared';

import { ActivitiesComponent } from './activities/activities.component';
import { ActivityItemComponent } from './activity-item/activity-item.component';
import { ReportStatsComponent } from './report-stats/report-stats.component';
import { ReportSummaryComponent } from './report-summary/report-summary.component';
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
    ButtonModule,
    IconModule,
    InputModule,
    TimelineModule
  ],
  declarations: [ReportsComponent, ReportStatsComponent, ActivitiesComponent, ActivityItemComponent, ReportSummaryComponent]
})
export class ReportsModule { }
