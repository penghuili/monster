import { Component, Input } from '@angular/core';
import { ChartDataItem, COLORS } from '@app/model';

@Component({
  selector: 'mst-project-progress-chart',
  templateUrl: './project-progress-chart.component.html',
  styleUrls: ['./project-progress-chart.component.scss']
})
export class ProjectProgressChartComponent {
  @Input() size = '20rem 20rem';
  @Input() data: ChartDataItem[];

  colorScheme = {
    domain: [COLORS.PRIMARY, COLORS.ACCENT]
  };

  hasData() {
    return this.data && this.data[0].series.length > 1;
  }
}
