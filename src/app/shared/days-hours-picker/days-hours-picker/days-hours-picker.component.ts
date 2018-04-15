import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'mst-days-hours-picker',
  templateUrl: './days-hours-picker.component.html',
  styleUrls: ['./days-hours-picker.component.scss']
})
export class DaysHoursPickerComponent {
  @Output() dayChange = new EventEmitter<number>();
  @Output() hourChange = new EventEmitter<number>();
  days = 0;
  hours = 0;
  isDaysActive = false;

  // hours: [0, 6], days: [0, 14]
  minDay = 0;
  maxDay = 14;
  minHour = 0;
  maxHour = 6;
  min = this.minHour;
  max = this.maxHour;
  defaultValue = 0;

  showSlider = false;

  onShowSlider() {
    this.showSlider = true;
  }
  onClickDays() {
    this.min = this.minDay;
    this.max = this.maxDay;
    this.defaultValue = this.days;
    this.isDaysActive = true;
  }
  onClickHours() {
    this.min = this.minHour;
    this.max = this.maxHour;
    this.defaultValue = this.hours;
    this.isDaysActive = false;
  }
  onValueChange(value: number) {
    if (this.isDaysActive) {
      this.days = Math.floor(value);
      this.dayChange.emit(this.days);
    } else {
      const integer = Math.floor(value);
      const fraction = value - integer;
      this.hours = fraction < 0.5 ? integer : integer + 0.5;
      this.hourChange.emit(this.hours);
    }
  }
  onConfirm() {
    this.showSlider = false;
  }
  onCancel() {
    this.showSlider = false;
    this.days = this.minDay;
    this.hours = this.minHour;
    this.dayChange.emit(this.minDay);
    this.hourChange.emit(this.minHour);
  }

}
