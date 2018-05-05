import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * pick hours and minutes
 * @returns a time in minutes
 */
@Component({
  selector: 'mst-duration-picker',
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.scss']
})
export class DurationPickerComponent {
  @Input() set duration(value: number) {
    this._duration = value ? value : 0;
    if (this._duration) {
      this.hours = this.getHours(this._duration);
      this.minutes = this.getMinutes(this._duration);
      this.defaultValue = this.isHoursActive ? this.hours : this.minutes;
    }
  }
  @Output() change = new EventEmitter<number>();

  // hours: [0, 6], min: [0, 60]
  minHour = 0;
  maxHour = 6;
  minMinute = 0;
  maxMinute = 60;
  // default show hours
  isHoursActive = true;
  min = this.minHour;
  max = this.maxHour;
  defaultValue = 0;

  minutes = 0;
  hours = 0;

  showSlider = false;

  private _duration: number;

  onShowSlider() {
    this.showSlider = true;
  }
  onClickMinutes() {
    this.min = this.minMinute;
    this.max = this.maxMinute;
    this.defaultValue = this.minutes;
    this.isHoursActive = false;
  }
  onClickHours() {
    this.min = this.minHour;
    this.max = this.maxHour;
    this.defaultValue = this.hours;
    this.isHoursActive = true;
  }
  onValueChange(value: number) {
    if (this.isHoursActive) {
      this.hours = Math.round(value);
      this.change.emit(this.getDuration(this.hours, this.minutes));
    } else {
      this.minutes = Math.round(value / 10) * 10;
      this.change.emit(this.getDuration(this.hours, this.minutes));
    }
  }
  onConfirm() {
    this.showSlider = false;
  }
  onCancel() {
    this.showSlider = false;
    this.hours = this.getHours(this._duration);
    this.minutes = this.getMinutes(this._duration);
    this.isHoursActive = true;
    this.defaultValue = this.hours;
  }

  private getHours(duration: number): number {
    return Math.floor(duration / 60);
  }
  private getMinutes(duration: number): number {
    return duration - this.getHours(duration) * 60;
  }
  private getDuration(hours: number, minutes: number): number {
    return hours * 60 + minutes;
  }

}
