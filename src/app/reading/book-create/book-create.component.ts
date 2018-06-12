import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReadingService } from '@app/core';
import { now, ProjectStatus, TimeRangeType } from '@app/model';
import { DatepickerResult, InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { addDays } from 'date-fns';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'mst-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.scss']
})
export class BookCreateComponent extends Unsub implements OnInit {
  @Output() created = new EventEmitter<boolean>();
  isShow = false;

  titleControl = new InputControl({ required: true });
  noteControl = new InputControl({ required: false });
  chaptersControl = new InputControl({ required: true });
  chaptersPerDayControl = new InputControl({ required: true });

  startDate = now();
  endDate = addDays(this.startDate, 1).getTime();

  TimeRangeType = TimeRangeType;

  constructor(private readingService: ReadingService) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.chaptersControl.value$.pipe(
        filter(a => !!a),
        debounceTime(300)
      ).subscribe(() => {
        this.calcEndDate();
      })
    );

    this.addSubscription(
      this.chaptersPerDayControl.value$.pipe(
        filter(a => !!a),
        debounceTime(300)
      ).subscribe(() => {
        this.calcEndDate();
      })
    );
  }

  onOpen() {
    this.isShow = true;
  }
  onPickStartDate(result: DatepickerResult) {
    this.startDate = result.date;
    this.calcEndDate();
  }
  onFinish() {
    if (this.titleControl.valid && +this.chaptersControl.getValue() && +this.chaptersPerDayControl.getValue()) {
      this.addSubscription(
        this.readingService.add({
          title: this.titleControl.getValue(),
          chapters: +this.chaptersControl.getValue(),
          chaptersPerDay: +this.chaptersPerDayControl.getValue(),
          note: this.noteControl.getValue(),
          startDate: this.startDate,
          endDate: this.endDate
        }).subscribe(success => {
          if (success) {
            this.isShow = false;
            this.created.emit(true);
            this.reset();
          }
        })
      );
    }
  }
  onCancel() {
    this.isShow = false;
    this.reset();
  }

  private calcEndDate() {
    const chapters = +this.chaptersControl.getValue();
    const chaptersPerDay = +this.chaptersPerDayControl.getValue();
    if (chapters && chaptersPerDay) {
      const days = Math.ceil(chapters / chaptersPerDay);
      this.endDate = addDays(this.startDate, days - 1).getTime();
    } else {
      this.endDate = addDays(this.startDate, 1).getTime();
    }
  }
  private reset() {
    this.titleControl.reset();
    this.noteControl.reset();
    this.chaptersControl.reset();
    this.chaptersPerDayControl.reset();
    this.startDate = now();
    this.calcEndDate();
  }
}
