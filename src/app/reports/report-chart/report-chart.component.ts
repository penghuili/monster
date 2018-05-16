import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/core';
import { ChartDataItem, createChartData, TimeRangeType, Report } from '@app/model';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-report-chart',
  templateUrl: './report-chart.component.html',
  styleUrls: ['./report-chart.component.scss']
})
export class ReportChartComponent extends Unsub implements OnInit {
  data: ChartDataItem[];

  RATIO = 'RATIO';
  PLANNEDFINISHED = 'PLANNEDFINISHED';
  PLANNEDUSEDTIME = 'PLANNEDUSEDTIME';
  FINISHTOO = 'FINISHTOO';
  ADDLATER = 'ADDLATER';
  BEFORE = 'BEFORE';
  WAITING = 'WAITING';
  WONTDO = 'WONTDO';
  active: string;

  private reports: Report[];

  constructor(private reportService: ReportService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.reportService.getReports(TimeRangeType.Day).subscribe(reports => {
        this.reports = (!reports || reports.length === 0 ? [] : reports).sort((a, b) => a.date - b.date);

        this.active = this.RATIO;
        this.data = [{
          name: 'finished ratio',
          series: this.reports.map(a => ({ name: new Date(a.date), value: (a.done + a.wontDo) / a.planned }))
        }];
      })
    );
  }

  onRatio() {
    this.active = this.RATIO;
    this.data = [{
      name: 'finished ratio',
      series: this.reports.map(a => ({ name: new Date(a.date), value: (a.done + a.wontDo) / a.planned }))
    }];
  }
  onPlannedFinished() {
    this.active = this.PLANNEDFINISHED;
    this.data = [
      {
        name: 'planned',
        series: this.reports.map(a => ({ name: new Date(a.date), value: a.planned }))
      },
      {
        name: 'finished',
        series: this.reports.map(a => ({ name: new Date(a.date), value: a.done + a.wontDo }))
      }
    ];
  }
  onPlannedUsedTime() {
    this.active = this.PLANNEDUSEDTIME;
    this.data = [
      {
        name: 'planned time',
        series: this.reports.map(a => ({ name: new Date(a.date), value: a.plannedTime }))
      },
      {
        name: 'used time',
        series: this.reports.map(a => ({ name: new Date(a.date), value: a.usedTimeOfTimeRange }))
      }
    ];
  }
  onFinishToo() {
    this.active = this.FINISHTOO;
    this.data = [
      {
        name: 'planned time',
        series: this.reports.map(a => ({ name: new Date(a.date), value: a.finishTooLate }))
      },
      {
        name: 'used time',
        series: this.reports.map(a => ({ name: new Date(a.date), value: a.finishTooEarly }))
      }
    ];
  }
  onAddLater() {
    this.active = this.ADDLATER;
    this.data = [{
      name: 'addedLater',
      series: this.reports.map(a => ({ name: new Date(a.date), value: a.addedLater }))
    }];
  }
  onBefore() {
    this.active = this.BEFORE;
    this.data = [{
      name: 'before',
      series: this.reports.map(a => ({ name: new Date(a.date), value: a.beforeToday }))
    }];
  }
  onWaiting() {
    this.active = this.WAITING;
    this.data = [{
      name: 'waiting',
      series: this.reports.map(a => ({ name: new Date(a.date), value: a.waiting }))
    }];
  }
  onWontdo() {
    this.active = this.WONTDO;
    this.data = [{
      name: `won't do`,
      series: this.reports.map(a => ({ name: new Date(a.date), value: a.wontDo }))
    }];
  }
}
