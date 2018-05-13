import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/core';
import { ChartDataItem, createChartData, TimeRangeType } from '@app/model';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-report-chart',
  templateUrl: './report-chart.component.html',
  styleUrls: ['./report-chart.component.scss']
})
export class ReportChartComponent extends Unsub implements OnInit {
  data: ChartDataItem[];

  constructor(private reportService: ReportService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.reportService.getReports(TimeRangeType.Day).subscribe(reports => {
        const data = reports.map(a => ({ name: a.date, value: (a.done + a.wontDo) / a.planned }));
        this.data = [
          {
            name: 'finished ratio',
            series: createChartData(data)
          }
        ];
      })
    );
  }

}
