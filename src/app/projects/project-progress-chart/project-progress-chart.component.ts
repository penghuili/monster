import { Component, Input } from '@angular/core';
import { COLORS } from '@app/model';
import { FONT_SIZE } from '@app/static';

@Component({
  selector: 'mst-project-progress-chart',
  templateUrl: './project-progress-chart.component.html',
  styleUrls: ['./project-progress-chart.component.scss']
})
export class ProjectProgressChartComponent {
  @Input() size = '20rem 20rem';
  @Input() data = [
    {
      name: 'planed',
      series: [
        {
          name: new Date('2018-05-06'),
          value: 2
        },
        {
          name: new Date('2018-05-07'),
          value: 5      },
        {
          name: new Date('2018-05-08'),
          value: 5
        },
        {
          name: new Date('2018-05-09'),
          value: 10
        },
        {
          name: new Date('2018-05-10'),
          value: 11      },
        {
          name: new Date('2018-05-11'),
          value: 15
        }
      ]
    },
    {
      name: 'done',
      series: [
        {
          name: new Date('2018-05-06'),
          value: 2
        },
        {
          name: new Date('2018-05-07'),
          value: 3
        }
      ]
    }
  ];

  colorScheme = {
    domain: [COLORS.PRIMARY, COLORS.ACCENT]
  };
}
