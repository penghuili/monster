import { Component, OnInit } from '@angular/core';
import { Habit, HabitStatus, now, TimeRangeType, WeekDays } from '@app/model';
import { InputControl } from '@app/shared';
import { addDays } from 'date-fns';

@Component({
  selector: 'mst-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.scss']
})
export class HabitDetailComponent implements OnInit {
  habit: Habit;
  titleControl = new InputControl({ required: true });
  resultControl = new InputControl({ required: true });

  status: HabitStatus;
  startDate = now();
  endDateStartDate = addDays(this.startDate, 1).getTime();
  endDate = this.endDateStartDate;

  TimeRangeType = TimeRangeType;

  private weekDays: WeekDays;

  constructor() { }

  ngOnInit() {
  }

}
