import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  ButtonModule,
  ChartModule,
  DatepickerModule,
  DragDropModule,
  IconModule,
  InputModule,
  MonsterCommonModule,
  OverlayModule,
  PipesModule,
  StylingModule,
  WithinAppModule,
} from '@app/shared';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ProjectCreateSubComponent } from './project-create-sub/project-create-sub.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectDetailSubComponent } from './project-detail-sub/project-detail-sub.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectTimelineItemComponent } from './project-timeline-item/project-timeline-item.component';
import { ProjectTimelineComponent } from './project-timeline/project-timeline.component';
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
    MonsterCommonModule,
    OverlayModule,
    WithinAppModule,
    ChartModule,
    PipesModule
  ],
  declarations: [
    ProjectsComponent,
    ProjectCreateComponent,
    ProjectDetailComponent,
    ProjectCreateSubComponent,
    ProjectDetailSubComponent,
    ProjectTimelineComponent,
    ProjectTimelineItemComponent
  ],
  exports: [
    ProjectsComponent,
    ProjectDetailComponent,
    ProjectDetailSubComponent
  ]
})
export class ProjectsModule { }
