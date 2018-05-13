import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { StylingModule } from '../styling/styling.module';
import { ProgressChartComponent } from './progress-chart/progress-chart.component';

@NgModule({
  imports: [
    CommonModule,
    StylingModule,
    NgxChartsModule
  ],
  declarations: [ProgressChartComponent],
  exports: [
    ProgressChartComponent
  ]
})
export class ChartModule { }
