import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectsComponent } from './projects/projects.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ProjectsComponent, ProjectCreateComponent, ProjectDetailComponent]
})
export class ProjectsModule { }
