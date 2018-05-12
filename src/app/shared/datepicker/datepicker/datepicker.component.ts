import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { now } from '@app/model';
import { setYear } from 'date-fns';

import { DatepickerMode, DatepickerResult } from '../model';

@Component({
  selector: 'mst-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
  @Input() set defaultDate(value: number) {
    this.outerDate = value;
    this.innerDate = value;
  }
  @Input() startDate = now();
  @Input() disabled = false;
  @Input() mode: DatepickerMode;
  @Output() finish = new EventEmitter<DatepickerResult>();
  outerDate = now();
  innerDate = this.outerDate;

  isShowDatepicker = false;
  isShowYear = false;

  DatepickerMode = DatepickerMode;
  showModePicker: boolean;

  ngOnInit() {
    if (this.mode === undefined) {
      this.mode = DatepickerMode.Day;
      this.showModePicker = true;
    } else {
      this.showModePicker = false;
    }
  }

  onOpenDatepicker() {
    if (!this.disabled) {
      this.innerDate = this.outerDate;
      this.isShowDatepicker = true;
    }
  }
  onSelectMode(mode: DatepickerMode) {
    this.mode = mode;
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
    this.finish.emit({ date: this.innerDate, mode: this.mode });
    this.isShowDatepicker = false;
  }
  onCancel() {
    this.isShowDatepicker = false;
    this.innerDate = this.outerDate;
  }
}
