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
  date = MonsterStorage.get('review-date') || now();
  mode = MonsterStorage.get('review-mode') || TimeRangeType.Day;
  datePickerStartDate: number;

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
  defaultTabKey = MonsterStorage.get('review-tab') || this.STATS;
  activeTabKey = this.defaultTabKey;

  constructor(private reportService: ReportService) {
    super();
  }

  ngOnInit() {
    // TODO: delete this later
    MonsterStorage.remove('report-tab');

    this.addSubscription(
      this.reportService.getReportStartDate().subscribe(startDate => {
        this.datePickerStartDate = startDate;
      })
    );
  }

  onChangeTab(tabKey: string) {
    this.activeTabKey = tabKey;
    MonsterStorage.set('review-tab', tabKey);
  }
  onPickDate(result: DatepickerResult) {
    this.date = result.date;
    this.mode = result.mode;

    MonsterStorage.set('review-date', this.date);
    MonsterStorage.set('review-mode', this.mode);
  }
  onShowChart() {
    this.showChart = true;
  }
  onCloseChart() {
    this.showChart = false;
  }

}
