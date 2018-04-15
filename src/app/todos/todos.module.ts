import { NgModule } from '@angular/core';
import {
  DatepickerModule,
  DaysHoursPickerModule,
  IconModule,
  InputModule,
  ListModule,
  MonsterCommonModule,
  StylingModule,
} from '@app/shared';
import { DndModule } from 'ngx-drag-drop';

import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { TodoTimerComponent } from './todo-detail/todo-timer/todo-timer.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodosRoutingModule } from './todos-routing.module';
import { TodosComponent } from './todos/todos.component';

@NgModule({
  imports: [
    IconModule,
    StylingModule,
    InputModule,
    ListModule,
    DndModule,
    MonsterCommonModule,
    DatepickerModule,
    DaysHoursPickerModule,

    TodosRoutingModule
  ],
  declarations: [
    TodosComponent,
    TodoItemComponent,
    TodoCreateComponent,
    TodoDetailComponent,
    TodoTimerComponent
  ]
})
export class TodosModule { }
