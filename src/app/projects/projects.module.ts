import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ButtonModule, DatepickerModule, DragDropModule, IconModule, InputModule, StylingModule } from '@app/shared';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { ProjectProgressChartComponent } from './project-progress-chart/project-progress-chart.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects/projects.component';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    StylingModule,
    ButtonModule,
    InputModule,
    DatepickerModule,
    FlexLayoutModule,
    IconModule,
    NgxChartsModule,

    ProjectsRoutingModule
  ],
  declarations: [
    ProjectsComponent,
    ProjectCreateComponent,
    ProjectDetailComponent,
    ProjectItemComponent,
    ProjectProgressChartComponent
  ]
})
export class ProjectsModule { }
