import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { HabitDetailComponent } from './habit-detail/habit-detail.component';
import { HabitsComponent } from './habits/habits.component';


const habitsRoutes: Routes = [
  {
    path: ROUTES.HABITS,
    children: [
      {
        path: ':id',
        component: HabitDetailComponent
      },
      {
        path: '', component: HabitsComponent, pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      habitsRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class HabitsRoutingModule {}
