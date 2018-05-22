import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HabitsModule } from '@app/habits';
import { ProjectsModule } from '@app/projects';

import { PlansRoutingModule } from './plans-routing.module';
import { PlansComponent } from './plans/plans.component';

@NgModule({
  imports: [
    CommonModule,
    ProjectsModule,
    HabitsModule,

    PlansRoutingModule
  ],
  declarations: [PlansComponent]
})
export class PlansModule { }
