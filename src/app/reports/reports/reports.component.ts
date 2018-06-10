import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/core';
import { MonsterStorage, now, TimeRangeType } from '@app/model';
import { DatepickerResult } from '@app/shared';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends Unsub implements OnInit {
  showChart = false;
  date = now();
  mode = TimeRangeType.Day;
  datePickerStartDate = now();

  STATS = 'stats';
  ACTIVITIES = 'activities';
  THOUGHTS = 'thoughts';
  SUMMARY = 'summary';
  tabs = [
    { key: this.STATS, value: this.STATS },
    { key: this.ACTIVITIES, value: this.ACTIVITIES },
    { key: this.THOUGHTS, value: this.THOUGHTS },
    { key: this.SUMMARY, value: this.SUMMARY },
  ];
  defaultTabKey = MonsterStorage.get('report-tab') || this.STATS;
  activeTabKey = this.defaultTabKey;


  constructor(private reportService: ReportService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.reportService.getReportStartDate().subscribe(startDate => {
        this.datePickerStartDate = startDate;
      })
    );
  }

  onChangeTab(tabKey: string) {
    this.activeTabKey = tabKey;
    MonsterStorage.set('report-tab', tabKey);
  }
  onPickDate(result: DatepickerResult) {
    this.date = result.date;
    this.mode = result.mode;
  }
  onShowChart() {
    this.showChart = true;
  }
  onCloseChart() {
    this.showChart = false;
  }

}
