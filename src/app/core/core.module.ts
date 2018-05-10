import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MonsterCommonModule } from '../shared/common/common.module';
import { IconModule } from '../shared/icon/icon.module';
import { StylingModule } from '../shared/styling/styling.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DbService } from './services/db.service';
import { IconsService } from './services/icons.service';
import { ProjectService } from './services/project.service';
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
    DbService
  ],
  declarations: [NavigationComponent],
  exports: [
    NavigationComponent
  ]
})
export class CoreModule { }
