import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { WeekDays } from '@app/model';

@Component({
  selector: 'mst-week-day-picker',
  templateUrl: './week-day-picker.component.html',
  styleUrls: ['./week-day-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekDayPickerComponent implements OnChanges {
  @Input() weekDays: WeekDays;
  @Input() editable = true;
  @Output() selected = new EventEmitter<WeekDays>();
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['weekDays'] && this.weekDays) {
      this.monday = this.weekDays.monday;
      this.tuesday = this.weekDays.tuesday;
      this.wednesday = this.weekDays.wednesday;
      this.thursday = this.weekDays.thursday;
      this.friday = this.weekDays.friday;
      this.saturday = this.weekDays.saturday;
      this.sunday = this.weekDays.sunday;
    }
  }

  onMonday() {
    if (this.editable) {
      this.monday = this.monday ? undefined : true;
      this.emitValue();
    }
  }
  onTuesday() {
    if (this.editable) {
      this.tuesday = this.tuesday ? undefined : true;
      this.emitValue();
    }
  }
  onWednesday() {
    if (this.editable) {
      this.wednesday = this.wednesday ? undefined : true;
      this.emitValue();
    }
  }
  onThursday() {
    if (this.editable) {
      this.thursday = this.thursday ? undefined : true;
      this.emitValue();
    }
  }
  onFriday() {
    if (this.editable) {
      this.friday = this.friday ? undefined : true;
      this.emitValue();
    }
  }
  onSaturday() {
    if (this.editable) {
      this.saturday = this.saturday ? undefined : true;
      this.emitValue();
    }
  }
  onSunday() {
    if (this.editable) {
      this.sunday = this.sunday ? undefined : true;
      this.emitValue();
    }
  }

  private emitValue() {
    this.selected.emit({
      monday: this.monday,
      tuesday: this.tuesday,
      wednesday: this.wednesday,
      thursday: this.thursday,
      friday: this.friday,
      saturday: this.saturday,
      sunday: this.sunday,
    });
  }
}
