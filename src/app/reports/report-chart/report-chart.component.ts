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
        const series = !reports || reports.length === 0 ?
          [] :
          reports
            .sort((a, b) => a.date - b.date)
            .map(a => ({ name: new Date(a.date), value: (a.done + a.wontDo) / a.planned }));
        this.data = [
          {
            name: 'finished ratio',
            series: series
          }
        ];
      })
    );
  }

}
