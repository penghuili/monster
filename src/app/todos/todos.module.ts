import { NgModule } from '@angular/core';
import { DatepickerModule, IconModule, InputModule, ListModule, MonsterCommonModule, StructureModule } from '@app/shared';
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
    MonsterCommonModule,
    DatepickerModule,

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
