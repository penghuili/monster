import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MonsterCommonModule } from '../shared/common/common.module';
import { IconModule } from '../shared/icon/icon.module';
import { PipesModule } from '../shared/pipes/pipes.module';
import { StylingModule } from '../shared/styling/styling.module';
import { WithinAppModule } from '../shared/within-app/within-app.module';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AppHeaderService } from './services/app-header.service';
import { DbService } from './services/db.service';
import { EventService } from './services/event.service';
import { HabitService } from './services/habit.service';
import { IconsService } from './services/icons.service';
import { InputService } from './services/input.service';
import { LoadingService } from './services/loading.service';
import { NotificationService } from './services/notification.service';
import { ProjectService } from './services/project.service';
import { ReportService } from './services/report.service';
import { RouterService } from './services/router.service';
import { SubprojectService } from './services/subproject.service';
import { ThoughtService } from './services/thought.service';
import { TodoService } from './services/todo.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    IconModule,
    MonsterCommonModule,
    StylingModule,
    WithinAppModule,
    PipesModule
  ],
  providers: [
    AppHeaderService,
    IconsService,
    ProjectService,
    TodoService,
    DbService,
    NotificationService,
    LoadingService,
    EventService,
    ReportService,
    ThoughtService,
    SubprojectService,
    HabitService,
    RouterService,
    InputService
  ],
  declarations: [NavigationComponent, LoadingComponent, AppHeaderComponent],
  exports: [
    NavigationComponent,
    LoadingComponent,
    AppHeaderComponent
  ]
})
export class CoreModule { }
