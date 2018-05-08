import { Component, EventEmitter, Input, Output } from '@angular/core';
import { now } from '@app/model';
import { setYear } from 'date-fns';

@Component({
  selector: 'mst-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent {
  @Input() set defaultDate(value: number) {
    this.date = value;
    this.innerDate = value;
  }
  @Input() startDate = now();
  @Input() disabled = false;
  @Output() finish = new EventEmitter<number>();
  date = now();
  isShowDatepicker = false;
  isShowYear = false;

  innerDate: number;

  onOpenDatepicker() {
    if (!this.disabled) {
      this.innerDate = this.date;
      this.isShowDatepicker = true;
    }
  }
  onOpenYear() {
    this.isShowYear = true;
  }
  onGotoToday() {
    this.innerDate = now();
  }
  onSelectYear(y: number) {
    this.isShowYear = false;
    this.innerDate = setYear(this.innerDate, y).getTime();
  }
  onSelectDate(date: number) {
    this.innerDate = date;
  }
  onFinish() {
    this.date = this.innerDate;
    this.finish.emit(this.date);
    this.isShowDatepicker = false;
  }
  onCancel() {
    this.isShowDatepicker = false;
  }
}
