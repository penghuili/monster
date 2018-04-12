import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@app/static';

import { TodoCreateComponent } from './todo-create/todo-create.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { TodosComponent } from './todos/todos.component';

const todosRoutes: Routes = [
  {
    path: ROUTES.TODOS,
    children: [
      {
        path: ROUTES.CREATE,
        component: TodoCreateComponent
      },
      {
        path: ':id',
        component: TodoDetailComponent
      },
      {
        path: '', component: TodosComponent, pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      todosRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class TodosRoutingModule {}
