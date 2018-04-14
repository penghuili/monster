import { Component, EventEmitter, Input, Output } from '@angular/core';
import { now } from '@app/model';
import { setYear } from 'date-fns';

@Component({
  selector: 'monster-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent {
  @Input() set defaultDate(value: number) {
    this.date = value;
  }
  @Output() finish = new EventEmitter<number>();
  date: number;
  isShowDatepicker = false;
  isShowYear = false;

  onOpenDatepicker() {
    this.date = this.date || now();
    this.isShowDatepicker = true;
  }
  onOpenYear() {
    this.isShowYear = true;
  }
  onSelectYear(y: number) {
    this.isShowYear = false;
    this.date = setYear(this.date, y).getTime();
  }
  onSelectDate(date: number) {
    this.date = date;
  }
  onFinish() {
    this.finish.emit(this.date);
    this.isShowDatepicker = false;
  }
  onCancel() {
    this.isShowDatepicker = false;
    this.date = undefined;
    this.finish.emit(undefined);
  }
}
