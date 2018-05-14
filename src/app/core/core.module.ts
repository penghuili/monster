import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MonsterCommonModule } from '../shared/common/common.module';
import { IconModule } from '../shared/icon/icon.module';
import { StylingModule } from '../shared/styling/styling.module';
import { LoadingComponent } from './components/loading/loading.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DbService } from './services/db.service';
import { EventService } from './services/event.service';
import { IconsService } from './services/icons.service';
import { LoadingService } from './services/loading.service';
import { NotificationService } from './services/notification.service';
import { ProjectService } from './services/project.service';
import { RecordService } from './services/record.service';
import { ReportService } from './services/report.service';
import { SubprojectService } from './services/subproject.service';
import { TodoService } from './services/todo.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    IconModule,
    MonsterCommonModule,
    StylingModule,
  ],
  providers: [
    IconsService,
    ProjectService,
    TodoService,
    DbService,
    NotificationService,
    LoadingService,
    EventService,
    ReportService,
    RecordService,
    SubprojectService
  ],
  declarations: [NavigationComponent, LoadingComponent],
  exports: [
    NavigationComponent,
    LoadingComponent
  ]
})
export class CoreModule { }
