import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserSupportGuard } from '@app/core';
import { ROUTES } from '@app/static';

import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { TodosComponent } from './todos/todos.component';

const todosRoutes: Routes = [
  {
    path: ROUTES.TODOS,
    canActivateChild: [BrowserSupportGuard],
    children: [
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
