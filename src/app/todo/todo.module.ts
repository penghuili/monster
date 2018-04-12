import { NgModule } from '@angular/core';
import { IconModule, InputModule, MonsterCommonModule, StructureModule } from '@app/shared';

import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { TodoTimerComponent } from './todo-detail/todo-timer/todo-timer.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoRoutingModule } from './todo-routing.module';
import { TodosComponent } from './todos/todos.component';

@NgModule({
  imports: [
    IconModule,
    StructureModule,
    InputModule,
    MonsterCommonModule,

    TodoRoutingModule
  ],
  declarations: [
    TodosComponent,
    TodoItemComponent,
    TodoCreateComponent,
    TodoDetailComponent,
    TodoTimerComponent
  ]
})
export class TodoModule { }
