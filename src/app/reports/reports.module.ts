import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  ButtonModule,
  ChartModule,
  DatepickerModule,
  IconModule,
  InputModule,
  PipesModule,
  StylingModule,
  TimelineModule,
  WithinAppModule,
} from '@app/shared';

import { ActivitiesComponent } from './activities/activities.component';
import { ReportChartComponent } from './report-chart/report-chart.component';
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
    TimelineModule,
    FlexLayoutModule,
    ChartModule
  ],
  declarations: [
    ReportsComponent,
    ReportStatsComponent,
    ActivitiesComponent,
    ReportSummaryComponent,

    ReportChartComponent,
  ]
})
export class ReportsModule { }
