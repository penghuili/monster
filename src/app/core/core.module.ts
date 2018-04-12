import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { IconsService } from './services/icons.service';
import { ProjectService } from './services/project.service';
import { TodoService } from './services/todo.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    IconsService,
    ProjectService,
    TodoService
  ],
  declarations: []
})
export class CoreModule { }
