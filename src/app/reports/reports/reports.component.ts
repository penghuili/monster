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
  date: number;
  mode: TimeRangeType;
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
    this.setDate();

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
    MonsterStorage.set('review-date-updated-at', now());
  }
  onShowChart() {
    this.showChart = true;
  }
  onCloseChart() {
    this.showChart = false;
  }

  private setDate() {
    const updatedAt = MonsterStorage.get('review-date-updated-at');
    const date = MonsterStorage.get('review-date');
    const mode = MonsterStorage.get('review-mode');
    if (date && updatedAt && now() - updatedAt < 60 * 60 * 1000) {
      this.date = date;
      this.mode = mode;
    } else {
      this.date = now();
      this.mode = TimeRangeType.Day;
    }
  }

}
