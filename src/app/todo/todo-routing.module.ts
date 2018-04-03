import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ROUTES } from '../static/routes';
import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { TodosComponent } from './todos/todos.component';

const todoRoutes: Routes = [
  {
    path: ROUTES.TODOS,
    component: TodosComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      todoRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class TodoRoutingModule {}
