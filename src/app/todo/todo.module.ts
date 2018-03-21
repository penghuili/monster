import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TodoRoutingModule } from './todo-routing.module';
import { TodosComponent } from './todos/todos.component';

@NgModule({
  imports: [
    CommonModule,

    TodoRoutingModule
  ],
  declarations: [TodosComponent]
})
export class TodoModule { }
