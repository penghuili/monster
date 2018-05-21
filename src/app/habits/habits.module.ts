import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  ButtonModule,
  DatepickerModule,
  DragDropModule,
  IconModule,
  InputModule,
  MonsterCommonModule,
  OverlayModule,
  PipesModule,
  StylingModule,
  WeekDayPickerModule,
  WithinAppModule,
} from '@app/shared';

import { HabitCreateComponent } from './habit-create/habit-create.component';
import { HabitDetailComponent } from './habit-detail/habit-detail.component';
import { HabitsRoutingModule } from './habits-routing.module';
import { HabitsComponent } from './habits/habits.component';

@NgModule({
  imports: [
    CommonModule,
    HabitsRoutingModule,
    ButtonModule,
    OverlayModule,
    InputModule,
    StylingModule,
    DatepickerModule,
    IconModule,
    MonsterCommonModule,
    WeekDayPickerModule,
    FlexLayoutModule,
    WithinAppModule,
    DragDropModule,
    PipesModule
  ],
  declarations: [
    HabitsComponent,
    HabitCreateComponent,
    HabitDetailComponent
  ]
})
export class HabitsModule { }