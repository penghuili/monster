import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TodoRoutingModule } from './todo-routing.module';
import { TodosComponent } from './todos/todos.component';
import { TodoItemComponent } from './todo-item/todo-item.component';

@NgModule({
  imports: [
    CommonModule,

    TodoRoutingModule
  ],
  declarations: [TodosComponent, TodoItemComponent]
})
export class TodoModule { }
