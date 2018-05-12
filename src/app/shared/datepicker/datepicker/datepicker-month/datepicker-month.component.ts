import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { now } from '@app/model';
import {
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  getDaysInMonth,
  setDate,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

import { DatepickerMode } from '../../model';

@Component({
  selector: 'mst-datepicker-month',
  templateUrl: './datepicker-month.component.html',
  styleUrls: ['./datepicker-month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerMonthComponent implements OnChanges {
  @Input() set activeDate(value: number) {
    this.originalDate = value;
    this.oneDayOfCurrentMonth = value !== undefined ? value : now();
  }
  @Input() startDate: number;
  @Input() mode: DatepickerMode;
  @Output() selectDate = new EventEmitter<number>();
  weeks: DayItem[] = [
    { value: 'M', selected: false, valid: true},
    { value: 'T', selected: false, valid: true},
    { value: 'W', selected: false, valid: true},
    { value: 'T', selected: false, valid: true},
    { value: 'F', selected: false, valid: true},
    { value: 'S', selected: false, valid: true},
    { value: 'S', selected: false, valid: true},
  ];
  row1: DayItem[];
  row2: DayItem[];
  row3: DayItem[];
  row4: DayItem[];
  row5: DayItem[];
  row6: DayItem[];

  oneDayOfCurrentMonth: number;
  private originalDate: number;

  ngOnChanges() {
    if (this.startDate && this.oneDayOfCurrentMonth) {
      this.createRows();
    }
  }

  nextMonth() {
    this.oneDayOfCurrentMonth = addMonths(this.oneDayOfCurrentMonth, 1).getTime();
    this.createRows();
  }
  prevMonth() {
    this.oneDayOfCurrentMonth = addMonths(this.oneDayOfCurrentMonth, -1).getTime();
    this.createRows();
  }
  onSelectDate(day: number) {
    this.selectDate.emit(setDate(this.oneDayOfCurrentMonth, day).getTime());
  }

  private isSelected(day: number): boolean {
    if (!day || this.originalDate === undefined || this.oneDayOfCurrentMonth === undefined || this.mode === undefined) {
      return false;
    }
    if (this.mode === DatepickerMode.Day) {
      const startOfActiveDay = startOfDay(this.originalDate).getTime();
      const endOfActiveDay = endOfDay(this.originalDate).getTime();
      const currentDay = setDate(this.oneDayOfCurrentMonth, day).getTime();
      return currentDay > startOfActiveDay && currentDay < endOfActiveDay;
    } else if (this.mode === DatepickerMode.Week) {
      const startOfActiveWeek = startOfWeek(this.originalDate, {weekStartsOn: 1}).getTime();
      const endOfActiveWeek = endOfWeek(this.originalDate, {weekStartsOn: 1}).getTime();
      const currentDay = setDate(this.oneDayOfCurrentMonth, day).getTime();
      return currentDay > startOfActiveWeek && currentDay < endOfActiveWeek;
    } else if (this.mode === DatepickerMode.Month) {
      const startOfActiveMonth = startOfMonth(this.originalDate).getTime();
      const endOfActiveMonth = endOfMonth(this.originalDate).getTime();
      const currentDay = setDate(this.oneDayOfCurrentMonth, day).getTime();
      return currentDay > startOfActiveMonth && currentDay < endOfActiveMonth;
    } else {
      throw Error('invalid date picker mode');
    }
  }
  private isValid(day: number): boolean {
    if (!day || this.oneDayOfCurrentMonth === undefined || !this.startDate) {
      return true;
    }
    const thisDate = format(setDate(this.oneDayOfCurrentMonth, day), 'YYYYMMDD');
    const startDate = format(this.startDate, 'YYYYMMDD');
    return thisDate >= startDate;
  }
  private createRows() {
    this.row1 = [];
    this.row2 = [];
    this.row3 = [];
    this.row4 = [];
    this.row5 = [];
    this.row6 = [];

    const totalDays = getDaysInMonth(this.oneDayOfCurrentMonth);
    const weekDayOfFirstDay = startOfMonth(this.oneDayOfCurrentMonth).getDay() || 7;
    Array(42).fill(1).forEach((a, i) => {
      const j = i + 1;
      const value = j < weekDayOfFirstDay || j > (weekDayOfFirstDay + totalDays - 1) ? '' : j - weekDayOfFirstDay + 1;
      const valid = this.isValid(+value);
      const selected = this.isSelected(+value);
      const data = { value, selected, valid };
      if (j <= 7) {
        this.row1.push(data);
      } else if (j <= 14) {
        this.row2.push(data);
      } else if (j <= 21) {
        this.row3.push(data);
      } else if (j <= 28) {
        this.row4.push(data);
      } else if (j <= 35) {
        this.row5.push(data);
      } else {
        this.row6.push(data);
      }
    });
  }

}

export interface DayItem {
  value: string | number;
  selected: boolean;
  valid: boolean;
}
