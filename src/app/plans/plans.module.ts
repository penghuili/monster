import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HabitsModule } from '@app/habits';
import { ProjectsModule } from '@app/projects';
import { ReadingModule } from '@app/reading';

import { PlansRoutingModule } from './plans-routing.module';
import { PlansComponent } from './plans/plans.component';

@NgModule({
  imports: [
    CommonModule,
    ProjectsModule,
    HabitsModule,
    ReadingModule,

    PlansRoutingModule
  ],
  declarations: [PlansComponent]
})
export class PlansModule { }
