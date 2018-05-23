import { Component, OnInit } from '@angular/core';
import { RecordService } from '@app/core';
import { now, Record, TimeRangeType } from '@app/model';
import { DatepickerResult } from '@app/shared';
import { Unsub } from '@app/static';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class RecordsComponent extends Unsub implements OnInit {
  records: Record[];
  defaultDate = now();

  isLoading = false;

  datepickerStartDate: number;

  private date = this.defaultDate;
  private mode = TimeRangeType.Day;
  private shouldLoad = new Subject<boolean>();

  constructor(private recordService: RecordService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.shouldLoad.asObservable().pipe(
        startWith(true),
        switchMap(() => this.getRecords(this.date, this.mode))
      ).subscribe(records => {
        this.records = records || [];
      })
    );

    this.addSubscription(
      this.recordService.getRecordStartDate().subscribe(startDate => {
        this.datepickerStartDate = startDate;
      })
    );
  }

  onPickDate(result: DatepickerResult) {
    this.date = result.date;
    this.mode = result.mode;
    this.shouldLoad.next(true);
  }
  onCreated() {
    this.shouldLoad.next(true);
  }

  private getRecords(date: number, mode: TimeRangeType) {
    this.isLoading = true;
    return this.recordService.getRecords(date, mode).pipe(
      tap(() => {
        this.isLoading = false;
      })
    );
  }

}
