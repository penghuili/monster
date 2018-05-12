import { Component, OnInit } from '@angular/core';
import { RecordService } from '@app/core';
import { now, Record } from '@app/model';
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
  date = this.defaultDate;

  isLading = false;

  datepickerStartDate: number;

  private shouldLoad = new Subject<boolean>();

  constructor(private recordService: RecordService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.shouldLoad.asObservable().pipe(
        startWith(true),
        switchMap(() => this.getRecords(this.date))
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

  onPickDate(date: number) {
    this.date = date;
    this.shouldLoad.next(true);
  }
  onCreated() {
    this.shouldLoad.next(true);
  }

  private getRecords(date: number) {
    this.isLading = true;
    return this.recordService.getRecordsByDay(date).pipe(
      tap(() => {
        this.isLading = false;
      })
    );
  }

}
