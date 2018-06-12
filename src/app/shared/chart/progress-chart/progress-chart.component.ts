import { Component, Input } from '@angular/core';
import { ChartDataItem, COLORS } from '@app/model';

@Component({
  selector: 'mst-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss']
})
export class ProgressChartComponent {
  @Input() size = '20rem 20rem';
  @Input() data: ChartDataItem[];

  colorScheme = {
    domain: [COLORS.PRIMARY, COLORS.ACCENT, COLORS.PURPLE]
  };

  hasData() {
    return this.data && this.data[0].series.length > 1;
  }
}
