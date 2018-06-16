import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabitService, TodoService } from '@app/core';
import { Habit, TODAY } from '@app/model';
import { ROUTES, Unsub } from '@app/static';

@Component({
  selector: 'mst-todos-habits',
  templateUrl: './todos-habits.component.html',
  styleUrls: ['./todos-habits.component.scss']
})
export class TodosHabitsComponent extends Unsub implements OnInit {
  habits: Habit[];
  activeTab: string;
  TODAY = TODAY;

  constructor(
    private habitService: HabitService,
    private router: Router,
    private todoService: TodoService) {
      super();
  }

  ngOnInit() {
    this.addSubscription(
      this.habitService.getTodaysHabits().subscribe(habits => {
        this.habits = habits;
      })
    );

    this.addSubscription(
      this.todoService.getActiveTab().subscribe(tab => {
        this.activeTab = tab;
      })
    );
  }

  onShowHabitDetail(habit: Habit) {
    this.router.navigateByUrl(`${ROUTES.PLANS}/${ROUTES.HABITS}/${habit.id}`);
  }

}
