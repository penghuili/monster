import { Component, EventEmitter, Input, Output } from '@angular/core';
import { now } from '@app/model';
import { addMonths, format, getDaysInMonth, setDate, startOfMonth } from 'date-fns';

@Component({
  selector: 'mst-datepicker-month',
  templateUrl: './datepicker-month.component.html',
  styleUrls: ['./datepicker-month.component.scss']
})
export class DatepickerMonthComponent {
  @Input() set activeDate(value: number) {
    this.originalDate = value;
    if (this.selectedDate !== this.originalDate) {
      this.selectedDate = value !== undefined ? value : now();
      this.createRows(this.selectedDate);
    }
  }
  @Output() selectDate = new EventEmitter<number>();
  weeks = [ 'M', 'T', 'W', 'T', 'F', 'S', 'S' ];
  row1: DayItem[];
  row2: DayItem[];
  row3: DayItem[];
  row4: DayItem[];
  row5: DayItem[];
  row6: DayItem[];
  activeDay: number;

  selectedDate: number;
  private originalDate: number;

  nextMonth() {
    this.selectedDate = addMonths(this.selectedDate, 1).getTime();
    this.createRows(this.selectedDate);
  }
  prevMonth() {
    this.selectedDate = addMonths(this.selectedDate, -1).getTime();
  }
  onSelectDate(day: number) {
    this.selectDate.emit(setDate(this.selectedDate, day).getTime());
  }

  private isSelected(day: number): boolean {
    if (!day || this.originalDate === undefined || this.selectedDate === undefined) {
      return false;
    }
    const original = format(this.originalDate, 'YYYYMMD');
    const selected = format(this.selectedDate, 'YYYYMM') + day;
    return original === selected;
  }
  private createRows(date: number) {
    this.row1 = [];
    this.row2 = [];
    this.row3 = [];
    this.row4 = [];
    this.row5 = [];
    this.row6 = [];
    this.activeDay = undefined;

    const totalDays = getDaysInMonth(date);
    const weekDayOfFirstDay = startOfMonth(date).getDay() || 7;
    Array(42).fill(1).forEach((a, i) => {
      const j = i + 1;
      const value = j < weekDayOfFirstDay || j > (weekDayOfFirstDay + totalDays - 1) ? '' : j - weekDayOfFirstDay + 1;
      if (this.isSelected(+value)) {
        this.activeDay = +value;
      }
      if (j <= 7) {
        this.row1.push(value);
      } else if (j <= 14) {
        this.row2.push(value);
      } else if (j <= 21) {
        this.row3.push(value);
      } else if (j <= 28) {
        this.row4.push(value);
      } else if (j <= 35) {
        this.row5.push(value);
      } else {
        this.row6.push(value);
      }
    });
  }

}

type DayItem = number | string;
