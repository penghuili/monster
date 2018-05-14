import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NotificationService, ReportService } from '@app/core';
import { Report, TimeRangeType } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { merge } from 'ramda';

@Component({
  selector: 'mst-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportSummaryComponent extends Unsub implements OnChanges {
  @Input() date: number;
  @Input() mode: TimeRangeType;
  summaryControl = new InputControl();
  autoFocus = false;

  private report: Report;

  constructor(
    private notificationService: NotificationService,
    private reportService: ReportService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.date && this.mode !== undefined) {
      this.addSubscription(
        this.reportService.getReportWithTodos(this.date, this.mode).subscribe(reportWithTodos => {
          this.report = reportWithTodos.report;
          if (reportWithTodos.report && reportWithTodos.report.summary) {
            this.summaryControl.setValue(reportWithTodos.report.summary);
            this.autoFocus = false;
          } else {
            this.summaryControl.setValue('');
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
