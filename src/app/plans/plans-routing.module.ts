import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserSupportGuard } from '@app/core';
import { FollowingDetailComponent, FollowingsComponent } from '@app/following';
import { HabitDetailComponent, HabitsComponent } from '@app/habits';
import { ProjectDetailComponent, ProjectDetailSubComponent, ProjectsComponent } from '@app/projects';
import { BookDetailComponent, BooksComponent } from '@app/reading';
import { ROUTES } from '@app/static';

import { PlansComponent } from './plans/plans.component';

const plansRoutes: Routes = [
  {
    path: ROUTES.PLANS,
    canActivateChild: [BrowserSupportGuard],
    children: [
      {
        path: ROUTES.PROJECTS,
        children: [
          {
            path: ':id',
            component: ProjectDetailComponent
          },
          {
            path: '', component: ProjectsComponent, pathMatch: 'full'
          }
        ]
      },
      {
        path: ROUTES.SUB_PROJECTS,
        children: [
          {
            path: ':subid',
            component: ProjectDetailSubComponent
          },
          {
            path: '', redirectTo: ROUTES.PROJECTS, pathMatch: 'full'
          }
        ]
      },
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
      },
      {
        path: ROUTES.READING,
        children: [
          {
            path: ':id',
            component: BookDetailComponent
          },
          {
            path: '', component: BooksComponent, pathMatch: 'full'
          }
        ]
      },
      {
        path: ROUTES.FOLLOWING,
        children: [
          {
            path: ':id',
            component: FollowingDetailComponent
          },
          {
            path: '', component: FollowingsComponent, pathMatch: 'full'
          }
        ]
      },
      {
        path: '', component: PlansComponent, pathMatch: 'full'
      }
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(
      plansRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class PlansRoutingModule {}
