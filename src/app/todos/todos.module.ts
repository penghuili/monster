import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  ButtonModule,
  DatepickerModule,
  DragDropModule,
  DurationPickerModule,
  IconModule,
  InputModule,
  MonsterCommonModule,
  OverlayModule,
  PipesModule,
  ProgressModule,
  StylingModule,
  WithinAppModule,
} from '@app/shared';
import { DndModule } from 'ngx-drag-drop';

import { SearchTodosComponent } from './search-todos/search-todos.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { TodoTimerComponent } from './todo-detail/todo-timer/todo-timer.component';
import { TodosRoutingModule } from './todos-routing.module';
import { TodosComponent } from './todos/todos.component';

@NgModule({
  imports: [
    ButtonModule,
    IconModule,
    StylingModule,
    InputModule,
    DndModule,
    MonsterCommonModule,
    DatepickerModule,
    DurationPickerModule,
    FlexLayoutModule,
    DragDropModule,
    ProgressModule,
    OverlayModule,
    WithinAppModule,
    PipesModule,

    TodosRoutingModule
  ],
  declarations: [
    TodosComponent,
    TodoDetailComponent,
    TodoTimerComponent,
    SearchTodosComponent,
  ]
})
export class TodosModule { }
