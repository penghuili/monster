import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/core';
import { now, TimeRangeType } from '@app/model';
import { DatepickerResult } from '@app/shared';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends Unsub implements OnInit {
  date = now();
  mode = TimeRangeType.Day;
  datePickerStartDate = now();

  STATS = 'stats';
  ACTIVITIES = 'activities';
  SUMMARY = 'summary';
  tabs = [
    { key: this.STATS, value: this.STATS },
    { key: this.ACTIVITIES, value: this.ACTIVITIES },
    { key: this.SUMMARY, value: this.SUMMARY },
  ];
  activeTab = this.STATS;

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
    this.activeTab = tabKey;
  }
  onPickDate(result: DatepickerResult) {
    this.date = result.date;
    this.mode = result.mode;
  }

}
