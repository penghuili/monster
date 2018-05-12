import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReportService } from '@app/core';
import { now } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportSummaryComponent extends Unsub implements OnChanges {
  @Input() date = now();
  summaryControl = new InputControl('');
  autoFocus = false;

  constructor(private reportService: ReportService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['date'] && this.date) {
      this.addSubscription(
        this.reportService.getReport(this.date).subscribe(report => {
          if (report) {
            this.summaryControl.setValue(report.summary);
            this.autoFocus = !report.summary;
          } else {
            this.summaryControl.setValue('');
            this.autoFocus = true;
          }
        })
      );
    }
  }

  onCreate() {
    const summary = this.summaryControl.getValue();
    this.reportService.createOrUpdateReport(this.date, {summary});
  }

}
