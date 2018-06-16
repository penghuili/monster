import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService, HabitService } from '@app/core';
import { calcHabitProgress, Habit, HabitItem, HabitStatus, isBeforeToday, mapWeekDay, now, WeekDays } from '@app/model';
import { InputControl } from '@app/shared';
import { Unsub } from '@app/static';
import { addDays } from 'date-fns';
import { merge } from 'ramda';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-habit-detail',
  templateUrl: './habit-detail.component.html',
  styleUrls: ['./habit-detail.component.scss']
})
export class HabitDetailComponent extends Unsub implements OnInit {
  habit: Habit;
  titleControl = new InputControl<string>({ required: true });
  resultControl = new InputControl<string>({ required: true });

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
        switchMap(() => this.habitService.getHabitWithItems(id))
      )
      .subscribe(value => {
        if (value && value.habit) {
          this.habit = value.habit;
          this.progress = calcHabitProgress(value.items, value.habit);

          this.titleControl.setValue(this.habit.title, {emitEvent: false});
          this.resultControl.setValue(this.habit.result, {emitEvent: false});
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

    this.addSubscription(
      this.titleControl.value$.pipe(
        debounceTime(300)
      ).subscribe(title => {
        this.update({ title });
      })
    );

    this.addSubscription(
      this.resultControl.value$.pipe(
        debounceTime(300)
      ).subscribe(result => {
        this.update({ result });
      })
    );
  }

  onDone() {
    const timestamp = now();
    const item: HabitItem = {
      habitId: this.habit.id,
      happenDate: timestamp,
      status: HabitStatus.Done,
      updatedAt: timestamp
    };
    this.addSubscription(
      this.habitService.finishHabitItem(item).subscribe(success => {
        if (success) {
          this.loadHabit.next(true);
        }
      })
    );
  }
  isDone() {
    return isBeforeToday(this.endDate);
  }

  private update(data: any) {
    this.habitService.update(merge(this.habit, data)).subscribe();
  }
}
