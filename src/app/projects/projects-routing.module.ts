import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { ProjectDetailSubComponent } from './project-detail-sub/project-detail-sub.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectsComponent } from './projects/projects.component';

const projectsRoutes: Routes = [
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
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      projectsRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class ProjectsRoutingModule {}
