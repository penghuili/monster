import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NotificationService, ReportService } from '@app/core';
import { Report, TimeRangeType } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { merge } from 'ramda';

@Component({
  selector: 'mst-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent extends Unsub implements OnChanges, OnInit {
  @Input() date: number;
  @Input() mode: TimeRangeType;
  summaryControl = new InputControl<string>();
  autoFocus = false;
  reports: Report[];

  private report: Report;

  constructor(
    private notificationService: NotificationService,
    private reportService: ReportService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.reportService.getReportsBefore().subscribe(reports => {
        this.reports = reports ? reports.filter(a => !!a.summary).sort((a, b) => b.date - a.date) : [];
      })
    );
  }

  ngOnChanges() {
    if (this.date && this.mode !== undefined) {
      this.addSubscription(
        this.reportService.getReportWithTodos(this.date, this.mode).subscribe(reportWithTodos => {
          this.report = reportWithTodos.report;
          if (reportWithTodos.report && reportWithTodos.report.summary) {
            this.summaryControl.setValue(reportWithTodos.report.summary);
            this.autoFocus = false;
          } else {
            this.summaryControl.reset();
            this.autoFocus = true;
          }
        })
      );
    }
  }

  onCreate() {
    if (this.report) {
      const summary = this.summaryControl.getValue();
      this.addSubscription(
        this.reportService.update(merge(this.report, {summary})).subscribe(report => {
          if (report) {
            this.notificationService.sendMessage('saved summary.');
          }
        })
      );
    }
  }

}
