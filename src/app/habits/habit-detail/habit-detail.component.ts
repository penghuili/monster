import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService, HabitService } from '@app/core';
import { EventType, Habit, mapWeekDay, MonsterEvents, now, WeekDays } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { addDays } from 'date-fns';
import { startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.scss']
})
export class HabitDetailComponent extends Unsub implements OnInit {
  habit: Habit;
  titleControl = new InputControl({ required: true });
  resultControl = new InputControl({ required: true });

  startDate: number;
  endDateStartDate: number;
  endDate: number;
  weekDays: WeekDays;
  needToDo: boolean;
  progress: WeekDays[];

  private loadHabit = new Subject<boolean>();

  constructor(
    private eventService: EventService,
    private habitService: HabitService,
    private route: ActivatedRoute) {
      super();
    }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');

    this.addSubscription(
      this.loadHabit.asObservable().pipe(
        startWith(true),
        switchMap(() => this.habitService.getById(id))
      )
      .subscribe(value => {
        if (value && value.habit) {
          this.habit = value.habit;
          this.progress = value.progress;
          this.titleControl.setValue(this.habit.title);
          this.resultControl.setValue(this.habit.result);
          this.startDate = this.habit.startDate;
          this.endDateStartDate = addDays(this.startDate, 1).getTime();
          this.endDate = this.habit.endDate;
          this.weekDays = {
            monday: this.habit.monday,
            tuesday: this.habit.tuesday,
            wednesday: this.habit.wednesday,
            thursday: this.habit.thursday,
            friday: this.habit.friday,
            saturday: this.habit.saturday,
            sunday: this.habit.sunday
          };
          this.needToDo = this.weekDays[mapWeekDay(now())];
        }
      })
    );
  }

  onDone() {
    const event = {
      action: MonsterEvents.FinishHabit,
      createdAt: now(),
      refId: this.habit.id,
      type: EventType.Habit
    };
    this.eventService.add(event).subscribe(success => {
      if (success) {
        this.loadHabit.next(true);
      }
    });
  }
}
