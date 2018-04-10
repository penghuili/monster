import { NgModule } from '@angular/core';

import { IconModule } from '../shared/icon/icon.module';
import { InputModule } from '../shared/input/input.module';
import { StructureModule } from '../shared/structure/structure.module';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectService } from './services/project.service';
import { TodoService } from './services/todo.service';
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

    TodoRoutingModule
  ],
  declarations: [
    TodosComponent,
    TodoItemComponent,
    TodoCreateComponent,
    TodoDetailComponent,
    ProjectsComponent,
    TodoTimerComponent
  ],
  providers: [
    ProjectService,
    TodoService
  ]
})
export class TodoModule { }
