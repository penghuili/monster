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
    this.outerDate = value;
    this.innerDate = value;
  }
  @Input() startDate = now();
  @Input() disabled = false;
  @Output() finish = new EventEmitter<number>();

  isShowDatepicker = false;
  isShowYear = false;

  outerDate = now();
  innerDate = this.outerDate;

  onOpenDatepicker() {
    if (!this.disabled) {
      this.innerDate = this.outerDate;
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
    this.finish.emit(this.innerDate);
    this.isShowDatepicker = false;
  }
  onCancel() {
    this.isShowDatepicker = false;
    this.innerDate = this.outerDate;
  }
}
