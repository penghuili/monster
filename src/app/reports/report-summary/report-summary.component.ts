import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from '@app/core';
import { now } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { merge } from 'ramda';
import { debounceTime, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'mst-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss']
})
export class ReportSummaryComponent extends Unsub implements OnInit {
  @Input() date = now();
  summaryControl = new InputControl('');

  constructor(private reportService: ReportService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.summaryControl.value$.pipe(
        debounceTime(300),
        filter(a => !!this.date),
        switchMap(summary => this.reportService.createOrUpdateReport(this.date, {summary}))
      ).subscribe()
    );
  }

}
