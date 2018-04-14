import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mst-datepicker-month-row',
  templateUrl: './datepicker-month-row.component.html',
  styleUrls: ['./datepicker-month-row.component.scss']
})
export class DatepickerMonthRowComponent {
  @Input() days: (number | string)[];
  @Input() activeDay: number;
  @Output() selectDay = new EventEmitter<number>();

  isActive(d: number | string): boolean {
    return this.activeDay === +d;
  }
  onClick(d: number) {
    if (d) {
      this.selectDay.emit(d);
    }
  }
}
