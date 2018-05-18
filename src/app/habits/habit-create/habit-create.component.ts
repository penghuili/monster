import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HabitService } from '@app/core';
import { HabitStatus, now, TimeRangeType, WeekDays } from '@app/model';
import { DatepickerResult, InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { addDays } from 'date-fns';

@Component({
  selector: 'mst-habit-create',
  templateUrl: './habit-create.component.html',
  styleUrls: ['./habit-create.component.scss']
})
export class HabitCreateComponent extends Unsub implements OnInit {
  @Output() created = new EventEmitter<boolean>();
  isShow = false;

  titleControl = new InputControl({ required: true });
  resultControl = new InputControl({ required: true });

  status: HabitStatus;
  startDate = now();
  endDateStartDate = addDays(this.startDate, 1).getTime();
  endDate = this.endDateStartDate;

  TimeRangeType = TimeRangeType;

  private weekDays: WeekDays;

  constructor(private habitService: HabitService) {
    super();
  }

  ngOnInit() {
  }

  onOpen() {
    this.isShow = true;
  }
  onSelectWeekDays(weekDays: WeekDays) {
    this.weekDays = weekDays;
  }
  onSelectStatus(status: HabitStatus) {
    this.status = status;
  }
  onPickStartDate(result: DatepickerResult) {
    this.startDate = result.date;
    this.endDateStartDate = addDays(this.startDate, 1).getTime();
    if (this.startDate > this.endDate) {
      this.endDate = addDays(this.startDate, 1).getTime();
    }
  }
  onPickEndDate(result: DatepickerResult) {
    this.endDate = result.date;
  }
  onFinish() {
    if (this.titleControl.valid && this.resultControl.valid && this.weekDays) {
      this.addSubscription(
        this.habitService.add({
          title: this.titleControl.getValue(),
          result: this.resultControl.getValue(),
          startDate: this.startDate,
          endDate: this.endDate,
          status: this.status === undefined ? HabitStatus.InProgress : this.status,
          ...this.weekDays
        }).subscribe(success => {
          if (success) {
            this.isShow = false;
            this.created.emit(true);
            this.reset();
          }
        })
      );
    }
  }
  onCancel() {
    this.isShow = false;
    this.reset();
  }

  private reset() {
    this.titleControl.reset();
    this.resultControl.reset();
    this.status = HabitStatus.InProgress;
    this.startDate = now();
    this.endDate = this.endDateStartDate;
    this.weekDays = null;
  }

}
