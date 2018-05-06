import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  ButtonModule,
  DatepickerModule,
  DragDropModule,
  DurationPickerModule,
  IconModule,
  InputModule,
  ListModule,
  MonsterCommonModule,
  OverlayModule,
  ProgressModule,
  StylingModule,
  WithinAppModule,
} from '@app/shared';
import { DndModule } from 'ngx-drag-drop';

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
    ListModule,
    DndModule,
    MonsterCommonModule,
    DatepickerModule,
    DurationPickerModule,
    FlexLayoutModule,
    DragDropModule,
    ProgressModule,
    OverlayModule,
    WithinAppModule,

    TodosRoutingModule
  ],
  declarations: [
    TodosComponent,
    TodoDetailComponent,
    TodoTimerComponent,
  ]
})
export class TodosModule { }
