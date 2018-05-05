import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DayItem } from '../datepicker-month/datepicker-month.component';

@Component({
  selector: 'mst-datepicker-month-row',
  templateUrl: './datepicker-month-row.component.html',
  styleUrls: ['./datepicker-month-row.component.scss']
})
export class DatepickerMonthRowComponent {
  @Input() days: DayItem[];
  @Output() selectDay = new EventEmitter<number>();

  onClick(d: DayItem) {
    if (d && d.valid && +d.value) {
      this.selectDay.emit(+d.value);
    }
  }
}
