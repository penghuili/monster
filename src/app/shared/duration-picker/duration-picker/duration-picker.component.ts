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
  @Input() set defaultValue(value: number) {
    this.outerValue = value ? value : 0;
    if (this.outerValue) {
      this.hours = this.getHours(this.outerValue);
      this.minutes = this.getMinutes(this.outerValue);
      this.activeValue = this.isHoursActive ? this.hours : this.minutes;
    }
  }
  @Input() disabled = false;
  @Output() change = new EventEmitter<number>();
  // never change outerValue
  outerValue = 0;

  // hours: [0, 6], min: [0, 60]
  minHour = 0;
  maxHour = 6;
  minMinute = 0;
  maxMinute = 60;
  // default show hours
  isHoursActive = false;
  min = this.minMinute;
  max = this.maxMinute;
  activeValue = 0;
  minutes = 0;
  hours = 0;

  showSlider = false;


  onShowSlider() {
    if (!this.disabled) {
      this.showSlider = true;
    }
  }
  onClickMinutes() {
    this.min = this.minMinute;
    this.max = this.maxMinute;
    this.activeValue = this.minutes;
    this.isHoursActive = false;
  }
  onClickHours() {
    this.min = this.minHour;
    this.max = this.maxHour;
    this.activeValue = this.hours;
    this.isHoursActive = true;
  }
  onValueChange(value: number) {
    if (this.isHoursActive) {
      this.hours = Math.round(value);
    } else {
      this.minutes = Math.round(value / 10) * 10;
    }
  }
  onConfirm() {
    this.showSlider = false;
    const duration = this.getDuration(this.hours, this.minutes);
    this.change.emit(duration);
  }
  onCancel() {
    this.showSlider = false;
    this.reset();
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
  private reset() {
    this.hours = this.getHours(this.outerValue);
    this.minutes = this.getMinutes(this.outerValue);
    this.isHoursActive = false;
    this.min = this.minMinute;
    this.max = this.maxMinute;
    this.activeValue = this.minutes;
  }

}
