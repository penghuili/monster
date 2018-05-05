import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectsComponent } from './projects/projects.component';

const projectsRoutes: Routes = [
  {
    path: ROUTES.PROJECTS,
    children: [
      {
        path: ROUTES.CREATE,
        component: ProjectCreateComponent
      },
      {
        path: ':id',
        component: ProjectDetailComponent
      },
      {
        path: '', component: ProjectsComponent, pathMatch: 'full'
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
