import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MonsterCommonModule, OverlayModule } from '@app/shared';

import { HabitCreateComponent } from './habit-create/habit-create.component';
import { HabitDetailComponent } from './habit-detail/habit-detail.component';
import { HabitsRoutingModule } from './habits-routing.module';
import { HabitsComponent } from './habits/habits.component';

@NgModule({
  imports: [
    CommonModule,
    HabitsRoutingModule,
    MonsterCommonModule,
    OverlayModule
  ],
  declarations: [HabitsComponent, HabitCreateComponent, HabitDetailComponent]
})
export class HabitsModule { }
