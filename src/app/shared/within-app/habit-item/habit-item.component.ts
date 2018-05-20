import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Habit } from '@app/model';

@Component({
  selector: 'mst-habit-item',
  templateUrl: './habit-item.component.html',
  styleUrls: ['./habit-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HabitItemComponent {
  @Input() habit: Habit;
}
