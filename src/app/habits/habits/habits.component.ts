import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitService } from '@app/core';
import { Habit, HabitStatus } from '@app/model';
import { Unsub } from '@app/static';

@Component({
  selector: 'mst-habits',
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.scss']
})
export class HabitsComponent extends Unsub implements OnInit {

  activeHabits: Habit[];
  somedayHabits: Habit[];
  doneHabits: Habit[];

  constructor(
    private habitService: HabitService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.habitService.getHabits().subscribe(habits => {
        habits = habits || [];
        this.activeHabits = habits.filter(a => a.status === HabitStatus.InProgress);
        this.somedayHabits = habits.filter(a => a.status === HabitStatus.Someday);
        this.doneHabits = habits.filter(a => a.status === HabitStatus.Done).sort((a, b) => b.finishAt - a.finishAt);
      })
    );
  }

  onShowDetail(habit: Habit) {
    this.router.navigate([habit.id], { relativeTo: this.route });
  }

}
