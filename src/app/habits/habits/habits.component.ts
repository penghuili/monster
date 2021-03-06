import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabitService } from '@app/core';
import { Habit, isAfterDay, isBeforeDay, isWithin, now, sortByPosition } from '@app/model';
import { Unsub } from '@app/static';
import { startWith, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'mst-habits',
  templateUrl: './habits.component.html',
  styleUrls: ['./habits.component.scss']
})
export class HabitsComponent extends Unsub implements OnInit {
  activeHabits: Habit[];
  somedayHabits: Habit[];
  doneHabits: Habit[];

  dragIndex: number;

  private loadHabits = new Subject<boolean>();

  constructor(
    private habitService: HabitService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
  }

  ngOnInit() {
    this.addSubscription(
      this.loadHabits.asObservable().pipe(
        startWith(true),
        switchMap(() => this.habitService.getHabits())
      )
      .subscribe(habits => {
        habits = <Habit[]>sortByPosition(habits || []);
        this.activeHabits = habits.filter(a => isWithin(now(), a.startDate, a.endDate));
        this.somedayHabits = habits.filter(a => isAfterDay(a.startDate, now()));
        this.doneHabits = habits.filter(a => isBeforeDay(a.endDate, now())).sort((a, b) => b.endDate - a.endDate);
      })
    );
  }

  onShowDetail(habit: Habit) {
    this.router.navigate([habit.id], { relativeTo: this.route });
  }
  onCreated() {
    this.loadHabits.next(true);
  }
  onDragStart(dragIndex: number) {
    this.dragIndex = dragIndex;
  }
  onDrop(dropIndex: number) {
    if (dropIndex !== this.dragIndex) {
      const dragged = this.activeHabits[this.dragIndex];
      const dropped = this.activeHabits[dropIndex];
      this.addSubscription(
        this.habitService.repositionHabits(dragged, dropped).subscribe(success => {
          if (success) {
            this.loadHabits.next(true);
          }
        })
      );
    }
  }

}
