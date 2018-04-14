import { NgModule } from '@angular/core';
import { IconModule, InputModule, ListModule, NotificationModule, StructureModule } from '@app/shared';
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
    StructureModule,
    InputModule,
    ListModule,
    DndModule,

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
