import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/core';
import { createReport, isFinishTooEarly, isFinishTooLate, now, Report, Todo, TodoStatus } from '@app/model';
import { Unsub } from '@app/static';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'mst-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends Unsub implements OnInit {
  date = now();
  datePickerStartDate = now();

  STATS = 'stats';
  ACTIVITIES = 'activities';
  SUMMARY = 'summary';
  tabs = [
    { key: this.STATS, value: this.STATS },
    { key: this.ACTIVITIES, value: this.ACTIVITIES },
    { key: this.SUMMARY, value: this.SUMMARY },
  ];
  // todo: change it back
  activeTab = this.ACTIVITIES;

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
  onPickDate(date: number) {
    this.date = date;
  }

}
